# Agent instructions — apps-nodalia

## Repository-specific deterministic quality contract (2026-10-26)

**Project:** Home Assistant add-on repository containing Nodalia components and Tailscale packaging.

**Engineering requirements:** Review .github/workflows/main.yml and tailscale-addon-ci.yml; run their packaging and manifest validation. Never publish/replace bundled binaries without hash and provenance checks.

**Verification commands:** python3 -m compileall -q nodalia_video_core tailscale_nodalia tailscale_nodalia_beta.

Before completion, run relevant checks and report exact pass/fail results. Add regression tests for changed behavior, bounds and failure paths. Never weaken/delete/skip tests, suppress warnings, or change CI thresholds to fabricate green results. Changes to `QUALITY_GATES.md`, this contract, and workflows require human review. The `quality` status must be required in branch protection to make the gate enforceable. If native dependencies prevent a test, explicitly report the blocker rather than claiming success. Existing project instructions have precedence for build setup; this section augments them.
