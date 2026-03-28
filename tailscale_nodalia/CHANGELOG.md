# Changelog

## 3.2.0 - 2026-03-28
### Changed
- Bump Tailscale: 1.96.2 → 1.96.4
- Add-on version: 3.1.0 → 3.2.0
## 3.1.0 - 2026-03-18
### Changed
- Bump Tailscale: 1.94.2 → 1.96.2
- Add-on version: 3.0.1 → 3.1.0
All notable changes to this app will be documented in this file.

The format is based on Keep a Changelog, and this project adheres to Semantic Versioning.

## 3.0.1 - 2026-03-14
### Fixed
- Logauth / onboarding:
  - se mantiene el flujo de `logauth` de la estable (incluyendo fallbacks de endpoint) y se mejora la sincronización de estado del panel tras el reset.
  - el panel aplica estado local de login requerido y refresco en vivo (`runtime.json`/`onboarding.json`) sin depender de recarga manual de Home Assistant.
- Web UI del panel:
  - marcador de build actualizado a `3.0.1` para validar visualmente la versión cargada en caché.

## 3.0.0 - 2026-02-18
### Changed
- Promoción a canal estable de la línea `3.0.0` (base de `3.0.0-rc3` en beta).
- Nuevo onboarding de Nodalia Connect en modo oscuro con UX simplificada y modo avanzado icon-only.
- Soporte Nodalia unificado con `virtual-keys`, TTL visible y controles de activación/revocación desde panel.
- Integración de scripts/servicios runtime (`support-api`, `runtime-status`) y mejoras de diagnóstico en vivo.

### Known Issues
- En algunos entornos, tras `Logauth` la transición visual a estado desconectado puede tardar más de lo esperado.
- Plan: corregir ajuste fino de `Logauth`/recarga en `3.0.1`.

## 2.2.0 - 2026-02-17
### Changed
- Bump Tailscale: 1.94.1 → 1.94.2
- Add-on version: 2.1.6 → 2.2.0

## 2.1.6 - 2026-02-10
### Changed
- Improve onboarding and Web UI startup flow in Home Assistant ingress:
  - onboarding now polls status faster and validates backend web readiness before redirect.
  - add dedicated `/webui` and `/webui-ready` routes for a more stable transition from onboarding.
  - include fallback behavior to onboarding on upstream errors to reduce visible 502 errors.
- Add startup timing telemetry in logs (`timings_sec={tailscale_up,ready_wait,total}`).
- Initialize onboarding state earlier with `Starting` state for faster UI feedback.
- Ensure `web` service is included in s6 `user` bundle startup (prevents ingress upstream `connection refused` loops).

### Fixed
- Fix persistent notification formatting for login-required flow (real line breaks, no literal `\\n`).
- Avoid unnecessary login-notification dismiss calls when no notification has been created yet.
- Reduce noisy taildrop logs by retrying with backoff and only polling while backend is `Running`.

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
