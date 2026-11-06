"""Regression tests for SonarCloud security fixes in the go2rtc proxy helpers."""

from __future__ import annotations

import unittest

from app.proxy_security import UnsafeProxyPathError, safe_proxy_target, sanitize_for_log


class SanitizeForLogTests(unittest.TestCase):
    def test_strips_newlines_and_tabs(self) -> None:
        self.assertEqual(sanitize_for_log("a\nb\rc\td"), "a b c d")

    def test_stringifies_non_strings(self) -> None:
        self.assertEqual(sanitize_for_log(42), "42")


class SafeProxyTargetTests(unittest.TestCase):
    def test_joins_relative_path(self) -> None:
        self.assertEqual(
            safe_proxy_target("http://127.0.0.1:1984", "api/streams"),
            "http://127.0.0.1:1984/api/streams",
        )

    def test_preserves_query(self) -> None:
        self.assertEqual(
            safe_proxy_target("http://127.0.0.1:1984", "api/ws", "src=cam1"),
            "http://127.0.0.1:1984/api/ws?src=cam1",
        )

    def test_rejects_traversal(self) -> None:
        with self.assertRaises(UnsafeProxyPathError):
            safe_proxy_target("http://127.0.0.1:1984", "../secret")

    def test_rejects_absolute_path(self) -> None:
        with self.assertRaises(UnsafeProxyPathError):
            safe_proxy_target("http://127.0.0.1:1984", "/etc/passwd")


if __name__ == "__main__":
    unittest.main()
