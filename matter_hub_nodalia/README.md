# Matter Hub (Nodalia)

Home Assistant app to bridge entities to Matter ecosystems.

## Notes

- Ingress is enabled.
- Data is stored in `/config/data`.
- This is a Nodalia packaging of Matter Hub.
- The image bundles the local `upstream/` source tree during build.

## Highlights in Stable 0.1.0

- Robotic vacuum room cleaning through Matter `ServiceArea` (Apple Home compatible).
- Improved Roborock operational state mapping for washing/emptying/drying-related flows.
- Vacuum identify command integration (`vacuum.locate`) for "play location sound".
- Enhanced bridged identity handling (manufacturer/model/serial/firmware) with optional manual overrides.
- Spanish UI improvements and cleaner bridge configuration editor UX.
