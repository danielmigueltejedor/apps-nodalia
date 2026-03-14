# Matter Hub (Nodalia Beta)

Home Assistant app to bridge entities to Matter ecosystems.

## Notes

- Ingress is enabled.
- Data is stored in `/config/data`.
- This is the Nodalia beta packaging of Matter Hub.
- The beta image bundles the local `upstream/` source tree during build (not only the latest npm package).

## Vacuum Room Cleaning (Beta)

- Robot vacuums can now expose Matter `ServiceArea` data for selective room cleaning.
- The parser supports common room/segment formats from Home Assistant attributes (`rooms`, `segments`, `room_mapping`, `room_map`, `segment_map`, etc.).
- Optional per-entity attributes to tune service calls:
  - `matter_service_area_action` (default: `vacuum.send_command`)
  - `matter_service_area_command` / `matter_service_area_command_key`
  - `matter_service_area_params_key` (default: `params`)
  - `matter_service_area_params_nested` (`true`/`false`, also supports `\"1\"` and `\"true\"`)
- Home Assistant `vacuum.clean_area` is supported by mapping areas to string IDs, for example:
  - `matter_service_area_action: vacuum.clean_area`
  - `matter_service_area_params_key: cleaning_area_id`
  - `room_map: { bano_del_dormitorio: \"Bano dormitorio\", despensa: \"Despensa\" }`
