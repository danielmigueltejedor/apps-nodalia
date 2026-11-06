from __future__ import annotations

import asyncio
import logging
import os
import signal
from pathlib import Path
from typing import Any

import httpx
import yaml

from .models import AddonConfig, CameraConfig
from .proxy_security import sanitize_for_log

LOGGER = logging.getLogger("nodalia_video_core.go2rtc")


class Go2RTCManager:
    def __init__(
        self,
        config: AddonConfig,
        config_path: Path = Path("/data/go2rtc.yaml"),
        binary: str = "/usr/local/bin/go2rtc",
    ) -> None:
        self.config = config
        self.config_path = config_path
        self.binary = binary
        self.process: asyncio.subprocess.Process | None = None
        self._lock = asyncio.Lock()
        self.generation = 0
        self._log_task: asyncio.Task[None] | None = None

    def build_config(self) -> dict[str, Any]:
        streams: dict[str, list[str]] = {}
        for camera_id, camera in self.config.cameras.items():
            streams[camera_id] = [self._stream_source(camera)]

        return {
            "api": {"listen": ":1984"},
            "rtsp": {"listen": self.config.rtsp_listen},
            "webrtc": {"listen": self.config.webrtc_listen},
            "streams": streams,
        }

    def _stream_source(self, camera: CameraConfig) -> str:
        return camera.source.url

    def write_config(self) -> None:
        self.config_path.parent.mkdir(parents=True, exist_ok=True)
        rendered = self.build_config()
        self.config_path.write_text(yaml.safe_dump(rendered, sort_keys=False), encoding="utf-8")
        LOGGER.info("Generated go2rtc config at %s", self.config_path)

    async def start(self) -> None:
        async with self._lock:
            self.write_config()
            if self.process and self.process.returncode is None:
                return
            LOGGER.info("Starting go2rtc")
            self.process = await asyncio.create_subprocess_exec(
                self.binary,
                "-config",
                str(self.config_path),
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.STDOUT,
            )
            self.generation += 1
            self._log_task = asyncio.create_task(self._log_output(self.process))

    async def stop(self) -> None:
        async with self._lock:
            if not self.process or self.process.returncode is not None:
                return
            LOGGER.info("Stopping go2rtc")
            self.process.terminate()
            try:
                await asyncio.wait_for(self.process.wait(), timeout=8)
            except asyncio.TimeoutError:
                LOGGER.warning("go2rtc did not stop gracefully; killing process")
                self.process.kill()
                await self.process.wait()

    async def restart(self) -> None:
        async with self._lock:
            LOGGER.warning("Restarting go2rtc")
            await self._stop_locked()
            self.write_config()
            self.process = await asyncio.create_subprocess_exec(
                self.binary,
                "-config",
                str(self.config_path),
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.STDOUT,
            )
            self.generation += 1
            self._log_task = asyncio.create_task(self._log_output(self.process))

    async def _stop_locked(self) -> None:
        if not self.process or self.process.returncode is not None:
            return
        self.process.terminate()
        try:
            await asyncio.wait_for(self.process.wait(), timeout=8)
        except asyncio.TimeoutError:
            self.process.kill()
            await self.process.wait()

    async def reload(self) -> None:
        self.write_config()
        if self.process and self.process.returncode is None:
            try:
                self.process.send_signal(signal.SIGHUP)
                self.generation += 1
                LOGGER.info("Sent SIGHUP to go2rtc")
                return
            except ProcessLookupError:
                pass
        await self.start()

    async def soft_reconnect(self, camera_id: str) -> bool:
        LOGGER.warning("[%s] Soft reconnect requested", sanitize_for_log(camera_id))
        urls = [
            f"{self.config.go2rtc_api}/api/streams?dst={camera_id}",
            f"{self.config.go2rtc_api}/api/streams?src={camera_id}",
        ]
        async with httpx.AsyncClient(timeout=5) as client:
            for url in urls:
                try:
                    response = await client.delete(url)
                    if response.status_code < 500:
                        LOGGER.debug("[%s] Cleared go2rtc stream endpoint: %s", camera_id, url)
                except httpx.HTTPError as exc:
                    LOGGER.debug("[%s] go2rtc soft reconnect endpoint failed: %s", camera_id, exc)
        await self.reload()
        return True

    async def get_streams(self) -> dict[str, Any]:
        async with httpx.AsyncClient(timeout=5) as client:
            response = await client.get(f"{self.config.go2rtc_api}/api/streams")
            response.raise_for_status()
            data = response.json()
            return data if isinstance(data, dict) else {"streams": data}

    async def is_responding(self) -> bool:
        try:
            await self.get_streams()
            return True
        except Exception as exc:
            LOGGER.debug("go2rtc health check failed: %s", exc)
            return False

    async def _log_output(self, process: asyncio.subprocess.Process) -> None:
        if process.stdout is None:
            return
        while True:
            line = await process.stdout.readline()
            if not line:
                break
            LOGGER.info("go2rtc: %s", line.decode("utf-8", errors="replace").rstrip())
        code = await process.wait()
        if code != 0 and os.environ.get("NVC_SHUTTING_DOWN") != "1":
            LOGGER.error("go2rtc exited with code %s", code)
