"""Helpers for safe go2rtc proxying (path traversal + log injection)."""

from __future__ import annotations

import re
from pathlib import PurePosixPath
from urllib.parse import urljoin, urlparse

_LOG_INJECTION_RE = re.compile(r"[\r\n\t]")


class UnsafeProxyPathError(ValueError):
    """Raised when a proxied path escapes the go2rtc API base."""


def sanitize_for_log(value: object) -> str:
    """Neutralize control chars that could forge log lines (Sonar S5145)."""
    return _LOG_INJECTION_RE.sub(" ", str(value))


def safe_proxy_target(base_url: str, path: str, query: str = "") -> str:
    """Join path onto go2rtc base URL while blocking path traversal (Sonar S7044)."""
    normalized = PurePosixPath(path)
    if normalized.is_absolute() or ".." in normalized.parts:
        raise UnsafeProxyPathError("Invalid proxy path")
    base = base_url if base_url.endswith("/") else f"{base_url}/"
    relative = normalized.as_posix().lstrip("/")
    target = urljoin(base, relative)
    base_parts = urlparse(base)
    target_parts = urlparse(target)
    base_path = base_parts.path.rstrip("/") or ""
    if target_parts.scheme != base_parts.scheme or target_parts.netloc != base_parts.netloc:
        raise UnsafeProxyPathError("Invalid proxy path")
    if base_path and not (
        target_parts.path == base_path or target_parts.path.startswith(base_path + "/")
    ):
        raise UnsafeProxyPathError("Invalid proxy path")
    if query:
        target = f"{target}?{query}"
    return target
