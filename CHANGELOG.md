# Changelog

All notable changes to this add-on will be documented in this file.

The format is based on Keep a Changelog, and this project adheres to Semantic Versioning.

## 1.2.7 - 2026-02-09
### Changed
- Improve startup robustness and diagnostics:
  - Add timeout when waiting for Tailscale `Running` state in `post-tailscaled`.
  - Add startup summary log with mode and effective options.
- Improve `share-homeassistant` reliability:
  - Add `curl` timeouts for Home Assistant availability checks.
  - Fix quoted argument handling to satisfy shellcheck.
- Improve migration and service customization safety:
  - Fix migration of `proxy_and_funnel_port` to `share_on_port`.
  - Make stage2 service-disable `rm` calls idempotent with `rm -f`.
- Improve build and supply-chain safety:
  - Remove strict Alpine package pinning that broke updates.
  - Verify downloaded Tailscale archive with SHA256 before extracting.
- Improve CI quality gates:
  - Add dedicated workflow for shellcheck + multi-arch image build (`amd64`, `arm64`).
- Update documentation wording from add-on terminology to app/aplicación in README.

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
