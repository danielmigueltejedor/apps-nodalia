# Changelog

## 0.1.0-beta.36
- Added automatic bridge root identity enrichment when a bridge exposes a single Home Assistant device: vendor, model, product label, serial number and firmware are now derived from that device metadata if not manually configured.
- Root-node serial now avoids hashed fallback values (e.g. `17d73...`) when Home Assistant provides serial data from the device or companion entities.
- Root-node firmware now prefers real software-version fields (including `update.*` companion entities) to avoid showing generic year-like values such as `2026`.
- Manual `deviceIdentity` overrides still keep highest priority and are not overwritten by auto-derived values.

## 0.1.0-beta.35
- Fixed firmware string selection precedence to avoid generic numeric `version` values (e.g. `2026`) overriding real software version strings.
- Firmware now prioritizes explicit software fields (`sw_version`, `software_version`, `firmware_version`, `update.installed_version/current_version`) and only uses generic `version` when it looks firmware-like (contains separators such as `.` / `_` / `-`).
- Prevents Home ecosystems from showing hardware-like version values as firmware when a real firmware string is available.

## 0.1.0-beta.34
- Added automatic firmware version resolution from Home Assistant companion entities on the same device (especially `update.*` entities using `installed_version/current_version`).
- Bridged vacuum `softwareVersionString` now updates dynamically from Home Assistant metadata when no manual override is set.
- Manual firmware override remains optional (`deviceIdentity.softwareVersionString`) and still has highest priority when explicitly configured.
- Clarified bridge config schema help text to explain that leaving firmware empty enables automatic Home Assistant version sync.

## 0.1.0-beta.33
- Added editable bridged identity fields for serial number and firmware string in bridge configuration (`deviceIdentity.serialNumber`, `deviceIdentity.softwareVersionString`).
- Updated bridge configuration schema/UI to expose:
  - Número de serie
  - Firmware (texto)
- Bridged device `BasicInformation` now resolves serial/firmware from:
  1) explicit bridge identity overrides,
  2) Home Assistant attributes/registry metadata,
  3) safe fallback values.
- Root bridge `BasicInformation` now also honors serial/firmware identity overrides, including derived numeric `softwareVersion` from firmware text when possible.

## 0.1.0-beta.32
- Fixed robotic vacuum operational-state “stuck in CleaningMop” behavior after returning to normal cleaning.
- `RvcOperationalState` resolution now prioritizes hints from the main vacuum entity first, and only uses companion entities (`sensor`/`binary_sensor`/`select`/`text`) as fallback when the main entity provides no clear operational match.
- Reduced false positives from companion entities by ignoring companion attribute collections/lists that can contain static status catalogs.

## 0.1.0-beta.31
- Improved robotic vacuum maintenance-state detection by expanding operational hint parsing for mop wash/dry and dust emptying flows.
- Added companion-entity status lookup: vacuum operational state now also inspects related `sensor`/`binary_sensor`/`select`/`text` entities on the same Home Assistant device when they look like status/task entities.
- Expanded hint synonyms and key matching (`status/state/task/phase/action/mop/dust/wash/dry/empty`) to better map Roborock-style states to Matter `RvcOperationalState`.
- Fixed bridge edit form data loss for identity overrides: `deviceIdentity` (`vendorName`/`productName`/`productLabel`) is now preserved and sent correctly when editing a bridge.

## 0.1.0-beta.30
- Improved Service Area progress reporting during selective room cleaning so Apple Home reflects active cleaning instead of staying in a “moving to room” style status.
- While vacuum is in `cleaning` state, Matter `ServiceArea.progress` now marks the active room as `Operating` (instead of all selected areas being `Pending`).
- Added active-area inference fallback: if Home Assistant does not provide `current_area/current_segment` yet, the bridge temporarily uses the first selected area as the active area for progress/currentArea reporting.

## 0.1.0-beta.29
- Added richer Robotic Vacuum operational-state mapping so Apple Home can reflect dock maintenance states from Home Assistant status hints.
- New mappings in `RvcOperationalState`:
  - Mop washing/self-clean -> `CleaningMop`
  - Water refill -> `FillingWaterTank`
  - Auto-empty -> `EmptyingDustBin`
  - Map updates -> `UpdatingMaps`
  - Charging and mop drying-like statuses -> `Charging`
- Status detection now considers `entity.state`, `attributes.status`, and additional operational hint attributes (`activity`, `operation`, `task_status`, `dock_state`, `charging_state`, etc.), with normalization for common formats.

## 0.1.0-beta.28
- Adjusted vacuum start debug logging to show effective selected service areas (state-first) instead of potentially stale stored IDs, so logs reflect the actual room selection used for selective cleaning.

## 0.1.0-beta.27
- Fixed remaining full-clean fallback after successful `selectAreas` by allowing selected-area action construction even when live parsed room metadata is temporarily unavailable (`hasData:false`).
- Added persistent action-config template (`action`, `command`, `commandKey`, `paramsKey`, `paramsNested`) captured from valid vacuum metadata and reused during transient updates.
- Added resilient selected-area action builder that falls back to Matter numeric area IDs with the persisted action template, preventing fallback to `vacuum.start`.
- Extended debug snapshot with `hasActionConfig` to quickly identify whether action template context is available.

## 0.1.0-beta.26
- Fixed a critical selective-clean context loss where Home Assistant transient updates without room metadata set `hasData:false`, clearing in-memory action-value mappings right before `start`.
- `VacuumServiceArea` now keeps previous valid parsed room/action data when incoming HA attributes temporarily omit room metadata.
- Added automatic fallback reconstruction from Matter `supportedAreas` state so room cleaning can still resolve actions even when HA payloads are temporarily incomplete.
- Added diagnostic log when fallback state-based reconstruction is used.

## 0.1.0-beta.25
- Fixed a remaining selective-clean race where `ServiceArea.selectAreas` stored IDs correctly, but immediate `start` still fell back to `vacuum.start`.
- `getSelectedAreasAction` now always attempts to build an action from stored selected IDs and can reuse a cached selective-clean action when temporary runtime state is incomplete.
- Relaxed selected-area action value resolution to fall back to numeric Matter area IDs when per-area action mapping is temporarily unavailable.
- Added deeper fallback diagnostics (`VacuumStartAction`/`VacuumServiceArea` snapshots) to explain exactly why selective-clean action generation failed if fallback happens again.

## 0.1.0-beta.24
- Fixed Apple Home selective-clean flow where valid `selectAreas` requests were dropped before start due over-strict filtering against in-memory action-value maps.
- `selectAreas` now persists normalized requested area IDs even when action-value mapping is temporarily unavailable.
- `getSelectedAreasAction` now falls back to numeric Matter area IDs when no explicit area-action mapping exists, avoiding fallback to plain `vacuum.start`.
- Added richer debug output for `selectAreas` including normalized request IDs and currently known supported area IDs.

## 0.1.0-beta.23
- Fixed TypeScript build regression introduced in `basic-information-server` identity fallback helpers where `hash()` could return `undefined`.
- `hash()` now always returns a string fallback, unblocking addon image builds on Home Assistant Supervisor.

## 0.1.0-beta.22
- Fixed Apple Home room-selection parsing in `ServiceArea.selectAreas` when `newAreas` arrives in non-plain-array payload shapes (iterable/array-like objects).
- Added robust area-id extraction for iterable and typed-array inputs, plus object `valueOf()` numeric wrappers.
- Added debug trace for unparsable `selectAreas` payloads to speed up diagnosis in addon logs.
- Added unit tests for bigint, iterable (`Set`) and typed-array (`Uint16Array`) area-selection payloads.

## 0.1.0-beta.21
- Improved bridged device identity metadata so Apple Home shows real manufacturer/model more reliably instead of bridge defaults.
- `BridgedDeviceBasicInformation` now also uses Home Assistant device registry fallbacks (`default_manufacturer`, `default_model`) and entity attributes (`manufacturer`, `brand`, `model`, `model_name`).
- Added human-friendly model fallback: when model IDs look opaque (e.g. `roborock.vacuum.a104`), the addon prefers a cleaned friendly name (e.g. `Qrevo S`) for `productName`.
- Improved `productLabel` fallback order to prioritize readable names (`friendly_name`, `name_by_user`, `name`) before generic defaults.
- Added optional bridge UI overrides for bridged device identity:
  - `Fabricante` (`deviceIdentity.vendorName`)
  - `Modelo` (`deviceIdentity.productName`)
  - `Etiqueta de producto` (`deviceIdentity.productLabel`)

## 0.1.0-beta.20
- Fixed vacuum selective-clean persistence when Matter controllers (Apple Home) send `ServiceArea.selectAreas` with IDs that can arrive as non-number runtime types (e.g. bigint).
- Normalized `selectedAreas` read from Matter state before filtering/mapping, preventing false-empty selections that triggered fallback `vacuum.start`.
- Updated start-action resolution to use normalized state-selected area IDs first, then stored selected IDs.
- Added richer debug logging for `selectAreas` to show selected IDs from state and from request payload.

## 0.1.0-beta.19
- Traducida al español la interfaz principal de gestión de puentes (listado, detalle, crear, editar y menús de acciones).
- Traducidos los textos del esquema de configuración del puente para que el formulario muestre etiquetas y descripciones en español.
- Mejorada la estética del editor de configuración con:
  - Contenedor visual más claro y moderno.
  - Selector de modo "Formulario / JSON" más legible.
  - Botones de acción y ayudas contextualizadas en español.
  - Ajustes de usabilidad en el formulario (`placeholders`, ayuda de puerto y orden de listas).

## 0.1.0-beta.18
- Improved vacuum room-selection persistence by tracking selected Matter areas not only from `selectAreas` command flow but also from current cluster state updates.
- Prevents room selections from being lost when Home Assistant entity attributes don't include selected areas (common when Apple Home starts cleaning via `RvcRunMode.changeToMode`).
- Added debug traces for stored area-selection updates to diagnose Apple Home selective-clean flows.

## 0.1.0-beta.17
- Added a vacuum-specific Identify behavior that maps Matter `identify` / `triggerEffect` commands to Home Assistant `vacuum.locate`.
- Enables Apple Home "play location sound" (identify) to trigger the robot locator sound through Matter Hub when the vacuum reports `LOCATE` support.
- Added debug traces for identify routing (`VacuumIdentifyServer`) to simplify troubleshooting in addon logs.

## 0.1.0-beta.16
- Changed vacuum `ServiceArea.selectAreas` behavior to update internal Matter room selection without immediately triggering a Home Assistant clean action.
- Preserved Matter-selected room IDs in backend state so subsequent `Start` commands (Apple Home `OnOff`/`RunMode`) can reliably launch selective room cleaning even when Home Assistant entity attributes do not mirror selected areas.
- Added debug traces to show whether start falls back to `vacuum.start` or uses selected room IDs, improving diagnosis of Apple Home command flow.

## 0.1.0-beta.15
- Fixed vacuum start behavior for Matter clients (including Apple Home) to honor selected Service Area rooms when available instead of always sending `vacuum.start`.
- Applied the same start-routing fix across `OnOff`, `RvcRunMode.start`, and `RvcOperationalState.resume` paths so room-based cleaning is consistent regardless of which Matter command path the controller uses.
- Added fallback behavior: if no selected Service Area rooms are present, the addon still uses regular `vacuum.start`.

## 0.1.0-beta.14
- Added resilient mDNS interface handling: if `mdns_network_interface` points to a missing interface (e.g. `eth0` after enabling host networking), Matter Hub now logs a warning and falls back to automatic interface selection instead of failing bridge startup.
- Prevented bridge startup crashes caused by stale interface names in addon options.

## 0.1.0-beta.13
- Enabled `host_network: true` for the Matter Hub addon so mDNS/commissioning traffic is advertised on the host LAN instead of the supervisor container subnet (`172.30.x.x`).
- Improves Apple Home commissioning reliability where pairing stalled after QR scan despite the bridge running.

## 0.1.0-beta.12
- Explicitly enabled `ServiceArea` optional Matter features (`MAPS`, `PROG`) when creating the robotic vacuum behavior, so `supportedMaps`/`progress` are conformant and writable.
- Prevented startup rollback loops caused by mismatched ServiceArea feature flags during endpoint initialization.

## 0.1.0-beta.11
- Fixed `ServiceArea` initialization for vacuums where Matter `MAPS` and/or `PROG` features are not enabled by cluster conformance.
- Prevented writes to `supportedMaps`/`progress` when those optional attributes are disallowed, avoiding startup rollback with `Conformance "MAPS": Matter does not allow you to set this attribute (135)`.
- Kept robust area handling (`mapId: null` fallback when maps feature is unavailable) so room selection remains functional.

## 0.1.0-beta.10
- Hardened robotic vacuum `ServiceArea` state initialization by enforcing safe defaults only for enabled features and avoiding writes to optional attributes when cluster conformance disallows them (`MAPS`/`PROG`).
- Added automatic disambiguation for duplicate area names on the same map to satisfy Matter `AreaInfo` uniqueness validation.
- Improved unhandled rejection diagnostics to include full stack traces and nested AggregateError causes, making behavior initialization failures visible in logs.

## 0.1.0-beta.9
- Fixed `ServiceArea` startup crash on Matter.js `0.16.10` by initializing `supportedMaps`, `supportedAreas`, `selectedAreas`, `currentArea`, and `progress` with safe defaults before behavior validation.
- Prevented `Cannot read properties of undefined (reading 'length')` during robotic vacuum endpoint initialization.

## 0.1.0-beta.8
- Added a global `unhandledRejection` safeguard in backend bootstrap to prevent container crashes from detached async promise rejections (including numeric rejection reasons like `3`).
- Improved logging of unhandled rejection reasons for faster troubleshooting.

## 0.1.0-beta.7
- Added support for Home Assistant `vacuum.clean_area` style calls using string area IDs (e.g. `cleaning_area_id: [\"despensa\"]`).
- Extended Service Area mapping to keep Matter numeric IDs while sending custom action values (number or string) to Home Assistant actions.
- Improved room/area parsing for object maps with non-numeric keys (e.g. `room_map: { bano_del_dormitorio: \"Bano dormitorio\" }`).

## 0.1.0-beta.6
- Fixed unhandled promise rejection crashes when a Home Assistant service call fails (e.g. vacuum action errors), preventing addon shutdown on `ERR_UNHANDLED_REJECTION`.

## 0.1.0-beta.5
- Fixed beta image build context by providing required package metadata files (`README.md`/`LICENSE`) expected by upstream bundling scripts.

## 0.1.0-beta.4
- Updated Matter.js packages to latest npm stable (`@matter/main`, `@matter/nodejs`, `@matter/general` => `0.16.10`).
- Added first beta support for exposing selective room cleaning through Matter Service Area for robot vacuums.
- Improved compatibility with multiple Home Assistant vacuum attribute formats:
  - tuple/object room maps (`room_mapping`, `room_map`, `segment_map`)
  - object/comma-separated selected area formats
  - mixed naming/id representations for segments and rooms
- Added configurable service action payload mapping for selective cleaning:
  - `matter_service_area_action`
  - `matter_service_area_command_key`
  - `matter_service_area_params_key`
  - boolean-like parsing for `matter_service_area_params_nested`
- Added/expanded vacuum service area unit tests for parser and request normalization behavior.
- Switched beta image build to package and install the local `upstream` Matter Hub sources, so beta features are included in the addon image.

## 0.1.0-beta.3
- Updated Matter Hub beta branding to the new polished logo:
  - `icon.png`
  - `logo.png`

## 0.1.0-beta.2
- Updated beta branding assets:
  - `icon.png`
  - `logo.png`

## 0.1.0-beta.1
- Initial Nodalia beta app packaging for Matter Hub.
