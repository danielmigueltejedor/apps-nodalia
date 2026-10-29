#!/usr/bin/env python3
"""Check every tracked shell script and export actual ShellCheck findings as SARIF.

Unlike the legacy Codacy Docker plugin this uses the runner's native ShellCheck,
so an incompatible Docker API can never be misreported as an empty clean scan.
"""
from __future__ import annotations

import json
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "results.sarif"
SHELLS = {"sh", "bash", "ash", "dash", "ksh"}


def shell_files() -> list[str]:
    tracked = subprocess.run(
        ["git", "ls-files", "-z"], cwd=ROOT, check=True, capture_output=True
    ).stdout
    matches = []
    for raw in tracked.split(b"\0"):
        if not raw:
            continue
        relative = raw.decode("utf-8", errors="surrogateescape")
        path = ROOT / relative
        if not path.is_file():
            continue
        try:
            first_line = path.open("rb").readline(256).decode("utf-8", "replace").strip()
        except OSError:
            continue
        if path.suffix in {".sh", ".bash"} or (
            first_line.startswith("#!")
            and any(part in SHELLS for part in first_line[2:].replace("/", " ").split())
        ):
            matches.append(relative)
    return sorted(matches)


def sarif_report(findings: list[dict]) -> dict:
    rules = {}
    results = []
    for finding in findings:
        rule = f"SC{finding['code']}"
        rules.setdefault(rule, {"id": rule, "shortDescription": {"text": rule}})
        location = {
            "physicalLocation": {
                "artifactLocation": {"uri": finding["file"]},
                "region": {
                    "startLine": finding["line"],
                    "startColumn": finding["column"],
                },
            }
        }
        severity = {"error": "error", "warning": "warning", "info": "note"}.get(
            finding.get("level"), "warning"
        )
        results.append({
            "ruleId": rule,
            "level": severity,
            "message": {"text": finding["message"]},
            "locations": [location],
        })
    return {
        "$schema": "https://json.schemastore.org/sarif-2.1.0.json",
        "version": "2.1.0",
        "runs": [{
            "tool": {"driver": {
                "name": "ShellCheck",
                "informationUri": "https://www.shellcheck.net/",
                "rules": [rules[key] for key in sorted(rules)],
            }},
            "results": results,
        }],
    }


def main() -> int:
    paths = shell_files()
    print(f"ShellCheck: {len(paths)} tracked shell scripts", flush=True)
    if paths:
        run = subprocess.run(
            ["shellcheck", "--format=json1", "--severity=warning", "--", *paths],
            cwd=ROOT, capture_output=True, text=True, check=False,
        )
        if run.returncode not in (0, 1):
            print(f"ShellCheck failed to execute: {run.stderr}", file=sys.stderr)
            return 2
        try:
            findings = json.loads(run.stdout)["comments"]
        except (ValueError, KeyError, TypeError):
            print("ShellCheck produced invalid JSON results", file=sys.stderr)
            return 2
    else:
        findings = []
    OUT.write_text(json.dumps(sarif_report(findings), indent=2) + "\n")
    print(f"ShellCheck findings: {len(findings)}; SARIF: {OUT.name}", flush=True)
    return 1 if findings else 0


if __name__ == "__main__":
    sys.exit(main())
