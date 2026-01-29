# Changelog

All notable changes to this add-on will be documented in this file.

The format is based on Keep a Changelog, and this project adheres to Semantic Versioning.

## 1.2.3 - 2026-01-29
### Fixed
- Fix permissions on s6-overlay `finish` scripts:
  - `mss-clamping/finish`
  - `forwarding/finish`
  This prevents `Permission denied` and `exit code 126` errors on stop/restart.

## 1.2.1 - 2026-01-29
### Changed
- Bump embedded Tailscale version to 1.2.1.

## 1.2.0 - 2026-01-29
### Changed
- Update `config.yaml` options/schema for better UX and stability:
  - Make `exit_node` optional (allow empty value in UI without validation errors).
  - Adjust/replace `exit_node` validation regex to avoid Supervisor schema parsing issues.
- General `config.yaml` maintenance/refactor.

### Fixed
- Supervisor stability: avoid invalid/overly complex regex patterns that could break `/addons/<slug>/info`.
