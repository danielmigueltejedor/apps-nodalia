# Changelog

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
