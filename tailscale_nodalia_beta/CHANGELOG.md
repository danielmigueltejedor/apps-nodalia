# Changelog

All notable changes to this app will be documented in this file.

The format is based on Keep a Changelog, and this project adheres to Semantic Versioning.

## 2.2.0-beta1 - 2026-02-10
### Added
- New runtime status service (`runtime-status`) that continuously writes `/data/tailscale-runtime.json` with:
  - backend state,
  - web UI readiness,
  - self online state,
  - DNS/host names,
  - IPv4/IPv6 addresses,
  - auth URL and update timestamp.
- New ingress endpoint `/runtime.json` for live diagnostics data in the onboarding UI.
- Expanded onboarding UI with a live technical panel:
  - runtime fields shown in real time,
  - quick diagnostics button,
  - "copy report" action with structured JSON diagnostics payload.
- Updated beta app branding assets (`icon.png` and `logo.png`) with the new Nodalia visual style.

### Changed
- Onboarding UX now combines startup guidance with operational telemetry, reducing dependence on logs for troubleshooting.

## 2.1.6-beta7 - 2026-02-10
### Fixed
- Fix critical Web UI startup regression:
  - ensure `web` service is part of `user` bundle startup (`s6-rc.d/user/contents.d/web`).
  - without this, nginx was up but upstream `127.0.0.1:25899` stayed closed and ingress showed repeated `connection refused`.

## 2.1.6-beta6 - 2026-02-10
### Changed
- Improve Web UI responsiveness after app startup:
  - reduce onboarding polling interval from 3s to 1s.
  - add fast retry (500ms) when backend is `Running` but web UI is not yet ready.
  - reduce `/webui-ready` probe timeouts to 1s.
  - reduce `/webui` upstream timeouts to 8s to avoid long visible hangs.

## 2.1.6-beta5 - 2026-02-10
### Fixed
- Avoid visible `502 Bad Gateway` after onboarding redirect:
  - add `/webui-ready` probe endpoint (direct proxy) used only for readiness checks.
  - make `/webui` user endpoint fallback to `/onboarding` on upstream errors.
  - redirect to `webui` with cache-busting query when ready.

## 2.1.6-beta4 - 2026-02-10
### Changed
- Improve onboarding-to-WebUI transition reliability:
  - onboarding now checks `webui` availability before redirecting.
  - if backend is `Running` but web is not ready yet, it keeps retrying instead of redirecting to a dead end.
  - add explicit "Abrir Web UI" action in onboarding.

### Fixed
- Avoid noisy/irrelevant HTTP error during startup notification handling:
  - persistent notification dismiss is now attempted only when a login notification was previously created.

## 2.1.6-beta3 - 2026-02-10
### Fixed
- Fix onboarding redirect when backend is `Running`:
  - add dedicated ingress route `/webui` that proxies directly to Tailscale web backend.
  - redirect onboarding success flow to `/webui` instead of `/`.
  - avoids fallback loop where root ingress could keep returning onboarding page.

## 2.1.6-beta2 - 2026-02-10
### Fixed
- Fix onboarding inside Home Assistant ingress iframe:
  - use relative paths (`onboarding.json`, `./`) instead of absolute (`/onboarding.json`, `/`).
  - prevents "Estado no disponible" caused by requests resolving outside ingress prefix.

## 2.1.6-beta1 - 2026-02-10
### Changed
- Reduce Web UI startup latency in Home Assistant ingress:
  - start `nginx` without waiting for `web` dependency, so `/onboarding` is available immediately.
  - tighten ingress upstream timeouts to fail fast and show onboarding quicker when backend web is not ready.
- Improve onboarding UX:
  - auto-refresh onboarding status every 3s.
  - auto-redirect to `/` when backend state becomes `Running`.
- Add startup timing telemetry in logs:
  - `timings_sec={tailscale_up,ready_wait,total}` in startup summary.
- Improve onboarding availability:
  - initialize `/data/tailscale-onboarding.json` early with `Starting` state.
- Reduce noisy Taildrop logs when storage is not ready:
  - poll only while backend is `Running`.
  - backoff retries on `Taildrop disabled; no storage directory`.

## 2.1.5-beta.1 - 2026-02-10
### Changed
- Beta channel release that tracks stable `2.1.5` improvements for validation before promotion.

## 2.1.5 - 2026-02-10
### Changed
- Improve perceived Web UI responsiveness on first load:
  - add short proxy connect/read/send timeouts for ingress `/`.
  - keep fast fallback to `/onboarding` on `502/503/504` when backend is slow/unavailable.

## 2.1.4 - 2026-02-10
### Changed
- Reduce startup wait in `local-network` service from up to 5 minutes to ~36 seconds.
- Reduce `post-tailscaled` readiness wait from up to 5 minutes to ~90 seconds.
- On readiness timeout, keep app startup in degraded mode instead of failing hard,
  so Home Assistant Web UI is available sooner during first install/update.

## 2.1.3 - 2026-02-10
### Changed
- Improve Web UI startup responsiveness:
  - Remove NGINX startup wait on Tailscale web backend readiness.
  - Add NGINX fallback for backend transient errors (`502/503/504`) to `/onboarding`.
- This avoids long loading periods in Home Assistant while Tailscale web is still initializing.

## 2.1.2 - 2026-02-10
### Added
- Add `webui_readonly` option (default `true`) to choose Web UI mode:
  - readonly mode (safer default),
  - full-control mode for actions like logout.

### Changed
- `web/run` now applies `--readonly` only when `webui_readonly` is enabled.
- Add logs indicating whether Web UI starts in readonly or full-control mode.

## 2.1.1 - 2026-02-10
### Fixed
- Fix onboarding access when Tailscale needs interactive login:
  - `post-tailscaled` now bounds `tailscale up` with a timeout to avoid hanging startup.
  - If state is `NeedsLogin`/`NeedsMachineAuth`, onboarding state is always written and exposed to UI.
  - Login URL is extracted from status/output fallback when needed.
- Include `NeedsMachineAuth` in pre-up readiness detection.
- Serve `/onboarding.json` through explicit NGINX `alias` for reliable file resolution.
- Enable `homeassistant_api` permission so persistent onboarding notifications can be created/dismissed.

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
- Enable `homeassistant_api` permission for this app so onboarding can create/dismiss persistent notifications without API permission errors.

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
