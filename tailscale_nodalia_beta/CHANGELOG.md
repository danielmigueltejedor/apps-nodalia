# Changelog

All notable changes to this app will be documented in this file.

The format is based on Keep a Changelog, and this project adheres to Semantic Versioning.

## 3.0.0-beta22 - 2026-02-11
### Fixed
- Fixed `403 Forbidden` regression in ingress root route after static-file handling changes.
- Root fallback now serves onboarding correctly while still allowing static assets like `nodalia-logo.png`.
- NGINX route normalized in both static and templated ingress configs to prevent root directory resolution issues.

## 3.0.0-beta21 - 2026-02-11
### Fixed
- Manual refresh actions in onboarding now provide clear feedback and deterministic behavior:
  - `Actualizar estado` now performs an explicit runtime+state refresh with visible loading state.
  - avoids the perception of no-op clicks when poll updates were subtle.
- `Recargar panel` now performs a true full reload and clears cached runtime snapshot first.
- Navigation polish:
  - quick action scroll target now adapts to the currently visible section (login/actions/state),
    avoiding apparent no-op behavior when `ok-box` is hidden.

## 3.0.0-beta20 - 2026-02-11
### Fixed
- Web UI loading reliability improved:
  - runtime readiness probe now uses a single robust fetch (body + timing) to avoid race conditions between dual HTTP checks.
  - keeps blocking readiness when backend still returns `Tailscale web interface is unavailable.`
- Logout UX consistency improved:
  - panel now waits and verifies backend transition to login-required states before confirming logout success.
  - avoids false success messages when backend remains `Running`.
- Onboarding static assets fixed under ingress:
  - nginx now serves real static files before fallback to onboarding.
  - resolves broken logo rendering (question mark placeholder).

## 3.0.0-beta19 - 2026-02-11
### Fixed
- Logout now enforces real session termination from Nodalia panel:
  - `control-api` adds a hard fallback path when backend stays `Running`
    (`tailscale down`, restart daemon, clear local state files, re-check status).
  - avoids false "Sesion cerrada" messages when session was not actually dropped.
- Web UI readiness gate hardened:
  - runtime check no longer marks Web UI as ready when backend returns
    `Tailscale web interface is unavailable.`
  - prevents opening iframe before it is truly operational.
- Onboarding navigation polish:
  - removed duplicate iframe action in hero.
  - quick action now scrolls to the currently relevant section (login/actions/status).
  - added Nodalia logo in panel header.

## 3.0.0-beta18 - 2026-02-11
### Fixed
- Logout action reliability from Nodalia panel:
  - `control-api` now validates that backend transitions to `NeedsLogin`/`NeedsMachineAuth`.
  - if state remains `Running`, it retries with `tailscale down` + `tailscale logout`.
  - returns explicit failure when logout is not actually applied.
- UI now disables logout action when backend is not `Running`, and shows clearer status messages after logout attempts.

## 3.0.0-beta17 - 2026-02-11
### Fixed
- Fix auto-redirect countdown reset loop in onboarding.
- Countdown now keeps a stable deadline and does not restart to `3s` on each poll refresh.

## 3.0.0-beta16 - 2026-02-11
### Added
- Nodalia Assist hardening:
  - support tunnel TTL (`support_tunnel_ttl_minutes`) with automatic revocation on expiry.
  - support tunnel audit trail (`enable/disable/ttl_expired`) stored in data and accessible from UI.
- New control/diagnostic capabilities from onboarding:
  - connectivity test (`diag`) through `/control-api`,
  - health score panel,
  - diagnostic JSON download.
- New quick operational workflow:
  - reconnect, logout, refresh, plus cleaner basic/advanced navigation.

### Changed
- Reduced onboarding page flicker further:
  - differential rendering for suggestions/health/runtime blocks.
  - avoid unnecessary auto-redirect state resets on each polling cycle.
  - lower repaint frequency when data has not materially changed.

## 3.0.0-beta15 - 2026-02-11
### Fixed
- Fix return button from Tailscale iframe to Nodalia panel under Home Assistant ingress.
- Switched from absolute path (`/onboarding`) to ingress-safe relative path (`./`) to avoid `404 Not Found`.

## 3.0.0-beta14 - 2026-02-11
### Added
- New operational control API endpoint: `/control-api`.
- New onboarding "Control rapido" actions:
  - `Reintentar conexion` (reconnect),
  - `Cerrar sesion` (logout),
  - `Actualizar estado ahora`.
- New basic/advanced UI mode toggle (persisted in browser local storage).

### Changed
- Onboarding now behaves as a true main control page:
  - critical controls remain always visible,
  - technical/advanced panels can be hidden for cleaner navigation.
- Log review note: current beta startup log is healthy (reaches `Running` quickly); only non-critical `resolv.conf` fallback warning observed.

## 3.0.0-beta13 - 2026-02-11
### Changed
- Reduced UI flicker on onboarding page:
  - incremental render updates instead of full visual reset on each poll.
  - only updates state text/class when values actually change.
  - avoids repeatedly hiding/showing main sections while polling.
- Better polling ergonomics:
  - slower polling when tab is not visible.
  - immediate refresh when returning to the tab.

## 3.0.0-beta12 - 2026-02-11
### Added
- Two-way navigation between onboarding panel and Tailscale iframe:
  - new quick access button to open iframe from onboarding.
  - floating "Volver al panel Nodalia" button injected in iframe view to return anytime.

### Changed
- Faster perceived onboarding load:
  - parallel fetch of onboarding/runtime state.
  - timeout-aware runtime reads.
  - local runtime cache hydration for immediate first paint.
  - adaptive polling cadence for warmup vs stable states.
- Refreshed onboarding visual design (clearer hero section, quick actions, improved layout on mobile).

## 3.0.0-beta11 - 2026-02-11
### Fixed
- Fix onboarding getting stuck in `NeedsLogin` after successful authentication.
- Onboarding now prioritizes live backend state from `runtime.json` over stale one-shot `onboarding.json`.
- Added explicit hint for `NeedsMachineAuth` state (admin approval required in Tailscale console).

## 3.0.0-beta10 - 2026-02-11
### Fixed
- Fix blank screen in Home Assistant ingress after forcing onboarding as entrypoint.
- Root path now serves `onboarding.html` directly instead of redirecting to `/onboarding`,
  avoiding ingress prefix issues in iframe contexts.

## 3.0.0-beta9 - 2026-02-11
### Changed
- App entrypoint now always opens onboarding (`/onboarding`) instead of embedding Tailscale Web UI directly at root.
- This guarantees the initial setup overlay is visible in the Home Assistant app panel on every open.
- Direct Web UI access remains available via the onboarding actions (`webui` / direct tailnet URL).

## 3.0.0-beta8 - 2026-02-11
### Fixed
- Fix `support-api` startup crash (`httpd: applet not found`) on Home Assistant base image.
- Install `busybox-extras` and run support API with `busybox-extras httpd`, restoring support tunnel UI backend.

## 3.0.0-beta7 - 2026-02-11
### Fixed
- Fix image build failure caused by unavailable `cloudflared` apk package on base image.
- `cloudflared` is now installed from official Cloudflare release binaries during build (arch-aware), restoring update/install reliability.

## 3.0.0-beta6 - 2026-02-11
### Fixed
- Startup robustness when login is pending:
  - `post-tailscaled` no longer fails startup if `tailscale up` returns non-zero but login URL/state indicates interactive login is required.
  - if `tailscale up` times out while backend is still `Starting`, app now continues in onboarding mode instead of failing hard.
  - ensures first install without prior login still reaches onboarding + login notification path reliably.

## 3.0.0-beta5 - 2026-02-11
### Added
- Remote support tunnel controls in onboarding:
  - `Activar tunel soporte` and `Desactivar tunel soporte` actions.
  - temporary URL display and one-click copy.
- New internal support API endpoint: `/support-api`.
- New support tunnel manager command: `support-tunnel` (`status|enable|disable`).
- Cloudflare quick tunnel runtime support (via `cloudflared`) for temporary support access.

### Changed
- Support activation is now gated by runtime checks:
  - `support_tunnel_enabled=true`,
  - backend `Running`,
  - current tailnet matching configured `support_tailnet_id`.
- Runtime telemetry now includes support tunnel fields
  (`support_enabled`, `support_tailnet_match`, `support_eligible`, `support_active`, `support_url`, `support_reason`).

## 3.0.0-beta4 - 2026-02-11
### Added
- Smart suggestions panel in onboarding with dynamic guidance based on runtime/login state.
- One-click copy helpers for common policy snippets:
  - ACL for self web UI access on port `5252`.
  - `tagOwners` block example for `tag:ha`.
- Optional auto-open flow to ingress Web UI once readiness is confirmed.

### Changed
- Runtime telemetry is richer for troubleshooting and UX decisions:
  - include `webui_ready_streak`, `webui_probe_s`, `uptime_sec`, `direct_webui_url`.
- Onboarding now relies on runtime telemetry for readiness (avoids redundant extra probe).
- Polling is now adaptive during warmup for faster perceived response without noisy redirects.

## 3.0.0-beta3 - 2026-02-11
### Fixed
- Fix runtime-status JSON serialization at startup:
  - avoid `jq --argjson` failures when startup values are transient/partial.
  - harden booleans and arrays parsing for `/data/tailscale-runtime.json`.
  - removes `jq: invalid JSON text passed to --argjson` errors seen in logs.

## 3.0.0-beta2 - 2026-02-11
### Added
- New onboarding wizard structure with explicit phases:
  - Step 1: authentication,
  - Step 2: web UI warmup,
  - Step 3: operational access.
- New guided profile helpers in onboarding with one-click copy:
  - `setup_profile: home_access`
  - `setup_profile: subnet_router`
- New session-control guidance panel with copyable diagnostic command.
- Runtime panel now includes additional operational fields:
  - `webui_readonly`,
  - `setup_profile`,
  - `share_mode`.

### Changed
- Web UI ingress access button remains disabled until two consecutive readiness checks pass.
- Direct tailnet Web UI action remains available in parallel for full-control fallback scenarios.

## 3.0.0-beta1 - 2026-02-11
### Changed
- Improve Web UI entry reliability in onboarding:
  - remove auto-redirect to ingress web UI.
  - require two consecutive `webui-ready` checks before enabling ingress Web UI button.
  - keep user on onboarding with clear status while web UI is still warming up.
- Add direct tailnet Web UI action:
  - onboarding now exposes `http://<tailscale-ip>:5252` when IPv4 is available.
  - helps bypass ingress sign-in/viewing limitations for full control scenarios.

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
