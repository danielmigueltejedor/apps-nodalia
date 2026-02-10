# Changelog

All notable changes to this add-on will be documented in this file.

The format is based on Keep a Changelog, and this project adheres to Semantic Versioning.

## 2.1.0 - 2026-02-10
### Added
- Login onboarding page in the app Web UI at `/onboarding`:
  - Shows backend state.
  - Exposes login URL when authentication is required.
  - Includes actions to copy/open login URL without checking logs.
- Runtime-generated onboarding JSON endpoint at `/onboarding.json`.
- Home Assistant persistent notification when Tailscale requires interactive login
  (`NeedsLogin` / `NeedsMachineAuth`), including onboarding guidance and direct URL when available.

### Changed
- `post-tailscaled` now supports onboarding mode:
  - Detects login-required states and keeps startup usable for user action instead of failing early.
  - Writes onboarding state to `/data/tailscale-onboarding.json`.
  - Dismisses login notification automatically when backend returns to `Running`.
- Healthcheck treats login-required states as healthy to avoid restart loops during first-time login.

## 2.0.2 - 2026-02-09
### Changed
- Align ingress fallback server config with ingress template to avoid drift in Web UI behavior.
- Align README/DOCS/translations defaults with effective `config.yaml` defaults and `setup_profile` behavior.
- Refresh `tailscale_nodalia/DOCS.md` to use app terminology and include `setup_profile`.

### Fixed
- Ensure `setup_profile` and `tailscaled` networking mode are consistent:
  - `tailscaled/run` now applies the effective userspace mode derived from `setup_profile`.
  - Prevents mismatches where profile-based services expected kernel mode while `tailscaled` still used userspace mode.
- Add CI metadata consistency checks (version/changelog/docs/translations sync) to prevent release drift.

## 2.0.1 - 2026-02-09
### Fixed
- Improve Web UI behavior inside Home Assistant ingress panel:
  - Keep direct proxying but rewrite Tailscale's `document.location.href = url`
    to `window.top.location.href = url` so the UI breaks out of iframe reliably.
  - Avoid dependence on popup windows that can be blocked by browser settings.

## 2.0.0 - 2026-02-09
### Changed
- Major release that consolidates the recent reliability, ingress, security-hardening and CI improvements.
- Added `setup_profile` (high-level setup profiles) to simplify configuration for common scenarios:
  - `home_access`
  - `subnet_router`
  - `exit_node`
  - `custom` (manual control, backward-compatible behavior)
- Added Spanish translation file for add-on options (`translations/es.yaml`), including the new `setup_profile`.
- Adopted versioning strategy from this release onward:
  - `X`: major changes.
  - `Y`: Tailscale upstream version updates.
  - `Z`: bug fixes and basic improvements.

## 1.2.9 - 2026-02-09
### Fixed
- Simplify ingress proxy template for Tailscale Web UI:
  - Remove IP allow/deny filter in ingress template.
  - Remove JavaScript `sub_filter` rewrite (`window.open`) and use direct proxying.
  - This improves compatibility with Home Assistant UI/webview flows where the page could remain loading indefinitely.

## 1.2.8 - 2026-02-09
### Fixed
- Improve ingress compatibility for Web UI:
  - Allow Supervisor internal subnet in NGINX ingress template instead of a single fixed IP.
  - This prevents Web UI hanging/loading issues on installations where ingress source IP differs.

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
