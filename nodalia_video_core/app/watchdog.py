from __future__ import annotations

import asyncio
import json
import logging
import math
from datetime import datetime, timezone

from .go2rtc import Go2RTCManager
from .health import apply_probe, extract_consumers, initial_health
from .models import AddonConfig, CameraHealth, CameraState, ProbeResult
from .proxy_security import sanitize_for_log

LOGGER = logging.getLogger("nodalia_video_core.watchdog")


class Watchdog:
    def __init__(self, config: AddonConfig, go2rtc: Go2RTCManager) -> None:
        self.config = config
        self.go2rtc = go2rtc
        self.cameras: dict[str, CameraHealth] = {
            camera_id: initial_health(camera_id, camera)
            for camera_id, camera in config.cameras.items()
        }
        self._tasks: list[asyncio.Task[None]] = []
        self._stop_event = asyncio.Event()

    async def start(self) -> None:
        for camera_id in self.config.cameras:
            self._tasks.append(asyncio.create_task(self._camera_loop(camera_id)))

    async def stop(self) -> None:
        self._stop_event.set()
        for task in self._tasks:
            task.cancel()
        await asyncio.gather(*self._tasks, return_exceptions=True)

    def list_cameras(self) -> list[dict]:
        return [camera.as_response() for camera in self.cameras.values()]

    def get_camera(self, camera_id: str) -> CameraHealth | None:
        camera = self.cameras.get(camera_id)
        if camera:
            camera.refresh_age()
        return camera

    async def reconnect_camera(self, camera_id: str, hard: bool = False) -> CameraHealth:
        if camera_id not in self.config.cameras:
            raise KeyError(camera_id)
        health = self.cameras[camera_id]
        await self._reconnect(camera_id, health, hard=hard, force=True)
        return health

    async def _camera_loop(self, camera_id: str) -> None:
        camera = self.config.cameras[camera_id]
        health = self.cameras[camera_id]
        LOGGER.info("[%s] Stream starting", camera_id)
        if camera.source.type == "rtsp" and camera.source.transport == "tcp":
            LOGGER.info("[%s] RTSP source configured with TCP transport", camera_id)

        while not self._stop_event.is_set():
            await self._check_camera(camera_id, health)
            await asyncio.sleep(camera.health.check_interval)

    async def _check_camera(self, camera_id: str, health: CameraHealth) -> None:
        camera = self.config.cameras[camera_id]
        if not await self.go2rtc.is_responding():
            health.state = CameraState.ERROR
            health.last_error = "go2rtc API is not responding"
            await self._reconnect(camera_id, health, hard=True)
            return

        try:
            streams = await self.go2rtc.get_streams()
            health.consumers = extract_consumers(streams, camera_id)
        except Exception as exc:
            LOGGER.debug("[%s] Unable to read go2rtc streams payload: %s", camera_id, exc)

        probe = await self._probe_stream(camera_id)
        previous_state = health.state
        apply_probe(health, camera, probe)
        health.refresh_age()

        if probe.video_detected:
            LOGGER.info(
                "[%s] Video OK: %s fps=%s bitrate=%s",
                camera_id,
                probe.video_codec or "unknown",
                probe.fps if probe.fps is not None else "unknown",
                probe.bitrate if probe.bitrate is not None else "unknown",
            )
            if previous_state in (CameraState.DEGRADED, CameraState.RECONNECTING):
                LOGGER.info("[%s] Stream recovered", camera_id)
            health.reconnect_count = 0
        else:
            LOGGER.warning(
                "[%s] Video probe failed: %s",
                camera_id,
                probe.error or "no video stream detected",
            )
            if self._is_local_stream_missing(probe):
                LOGGER.warning(
                    "[%s] Local go2rtc stream is missing; forcing go2rtc restart",
                    camera_id,
                )
                await self._reconnect(camera_id, health, hard=True, force=True)
                return
        if probe.audio_detected:
            LOGGER.info("[%s] Audio OK: %s", camera_id, probe.audio_codec or "unknown")
        elif probe.video_detected and camera.audio.enabled and camera.audio.expected:
            LOGGER.warning("[%s] Audio missing but expected, marking degraded", camera_id)

        if health.last_frame_age and health.last_frame_age > camera.health.frame_timeout:
            LOGGER.warning(
                "[%s] No frames received for %.1fs, marking degraded",
                camera_id,
                health.last_frame_age,
            )
            health.state = CameraState.DEGRADED

        if health.state == CameraState.DEGRADED and not probe.video_detected:
            await self._reconnect(camera_id, health)

    async def _probe_stream(self, camera_id: str) -> ProbeResult:
        url = f"rtsp://127.0.0.1:8554/{camera_id}"
        command = [
            "ffprobe",
            "-v",
            "error",
            "-rtsp_transport",
            "tcp",
            "-show_streams",
            "-show_format",
            "-of",
            "json",
            url,
        ]
        try:
            proc = await asyncio.create_subprocess_exec(
                *command,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
            )
            stdout, stderr = await asyncio.wait_for(proc.communicate(), timeout=12)
        except asyncio.TimeoutError:
            return ProbeResult(ok=False, error="ffprobe timed out")
        except FileNotFoundError:
            return ProbeResult(ok=False, error="ffprobe is not installed")

        if proc.returncode != 0:
            return ProbeResult(
                ok=False,
                error=stderr.decode("utf-8", errors="replace").strip() or "ffprobe failed",
            )

        try:
            payload = json.loads(stdout.decode("utf-8"))
        except json.JSONDecodeError as exc:
            return ProbeResult(ok=False, error=f"Invalid ffprobe JSON: {exc}")

        return self._parse_probe(payload)

    def _parse_probe(self, payload: dict) -> ProbeResult:
        video_stream = None
        audio_stream = None
        for stream in payload.get("streams", []):
            if stream.get("codec_type") == "video" and video_stream is None:
                video_stream = stream
            if stream.get("codec_type") == "audio" and audio_stream is None:
                audio_stream = stream

        bitrate = None
        raw_bitrate = payload.get("format", {}).get("bit_rate")
        if raw_bitrate:
            try:
                bitrate = int(raw_bitrate)
            except ValueError:
                bitrate = None

        fps = None
        if video_stream:
            fps = self._parse_fps(video_stream.get("avg_frame_rate") or video_stream.get("r_frame_rate"))

        return ProbeResult(
            ok=video_stream is not None,
            video_detected=video_stream is not None,
            video_codec=video_stream.get("codec_name") if video_stream else None,
            fps=fps,
            bitrate=bitrate,
            audio_detected=audio_stream is not None,
            audio_codec=audio_stream.get("codec_name") if audio_stream else None,
        )

    def _parse_fps(self, value: str | None) -> float | None:
        if not value or value == "0/0":
            return None
        if "/" in value:
            left, right = value.split("/", 1)
            try:
                divisor = float(right)
                if divisor == 0:
                    return None
                fps = float(left) / divisor
            except ValueError:
                return None
        else:
            try:
                fps = float(value)
            except ValueError:
                return None
        if math.isfinite(fps):
            return round(fps, 2)
        return None

    def _is_local_stream_missing(self, probe: ProbeResult) -> bool:
        error = probe.error or ""
        return "127.0.0.1:8554" in error and "404 Not Found" in error

    async def _reconnect(
        self,
        camera_id: str,
        health: CameraHealth,
        hard: bool = False,
        force: bool = False,
    ) -> None:
        camera = self.config.cameras[camera_id]
        now = datetime.now(timezone.utc)
        if force:
            health.reconnect_count = 0

        if health.last_reconnect and not force:
            elapsed = (now - health.last_reconnect).total_seconds()
            if elapsed < camera.health.reconnect_cooldown:
                return

        if health.reconnect_count >= camera.health.max_reconnect_attempts and not force:
            health.state = CameraState.OFFLINE
            health.last_error = (
                f"Exceeded max reconnect attempts ({camera.health.max_reconnect_attempts})"
            )
            LOGGER.error(
                "[%s] %s",
                sanitize_for_log(camera_id),
                sanitize_for_log(health.last_error),
            )
            return

        health.state = CameraState.RECONNECTING
        health.reconnect_count += 1
        health.last_reconnect = now

        if hard:
            LOGGER.warning("[%s] Hard reconnect requested", sanitize_for_log(camera_id))
            await self.go2rtc.restart()
        else:
            await self.go2rtc.soft_reconnect(camera_id)
