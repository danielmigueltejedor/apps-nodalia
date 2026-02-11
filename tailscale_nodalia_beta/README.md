# Home Assistant App: Tailscale (Nodalia Beta)

Tailscale es una VPN “zero config” que se instala en minutos, incluyendo tu instancia de Home Assistant.

Crea una red segura entre tus servidores, ordenadores y servicios en la nube.
Incluso separados por firewalls o subredes, Tailscale funciona y gestiona reglas de firewall por ti.

---

## Versión actual

`3.0.0-beta53`

Cambios destacados:
- Nuevo soporte remoto guiado en onboarding:
  - boton para activar/desactivar tunel temporal de soporte.
  - URL temporal copiable para asistencia remota.
  - controlado por validacion de tailnet y estado de Tailscale.
- Nueva configuracion de seguridad para soporte:
  - `support_tunnel_enabled` (default `false`),
  - `support_tailnet_id`,
  - `support_target_url`.
- Onboarding reforzado para un flujo mas autonomo:
  - sugerencias inteligentes segun estado real (login, warmup, readonly, ACL).
  - snippets copiable de ACL (`autogroup:self:5252`) y `tagOwners`.
  - auto-entrada opcional a Web UI cuando se confirma disponibilidad.
- Telemetria runtime ampliada:
  - `webui_ready_streak`,
  - `webui_probe_s`,
  - `uptime_sec`,
  - `direct_webui_url`.
- Deteccion de Web UI optimizada:
  - onboarding usa telemetria runtime (sin sondeo extra redundante),
  - polling adaptativo para reducir latencia percibida al estar en warmup.
- Corrección de robustez en runtime-status:
  - elimina error `jq --argjson` en arranque con datos transitorios.
  - serialización más segura de `/runtime.json`.
- Nuevo wizard de onboarding por pasos:
  - Autenticacion -> Warmup Web UI -> Acceso operativo.
- Asistentes de perfil con copia rapida:
  - `setup_profile: home_access`
  - `setup_profile: subnet_router`
- Panel de control de sesion con comando de diagnostico copiable.
- Panel runtime ampliado con `webui_readonly`, `setup_profile` y `share_mode`.
- Entrada a Web UI más estable desde onboarding:
  - se elimina la redirección automática.
  - solo habilita acceso ingress cuando detecta 2 comprobaciones consecutivas de `webui-ready`.
- Nuevo acceso directo por tailnet:
  - botón "Abrir Web UI directa (tailnet)" con URL `http://<tailscale-ip>:5252` cuando está disponible.
- Nueva base "major" para el canal beta:
  - panel de estado en vivo en onboarding (backend, webui_ready, online, DNS/host, IPs, timestamp).
  - endpoint interno `/runtime.json` para telemetría runtime sin revisar logs.
  - botón de diagnóstico rápido y copia de reporte técnico en JSON.
- Fix crítico de arranque de Web UI:
  - se asegura el arranque del servicio `web` en el bundle `user` de s6.
  - evita bucles de `connection refused` a `127.0.0.1:25899` en ingress.
- Web UI más rápida tras el arranque:
  - polling de onboarding más frecuente (1s) y reintento rápido (500ms) cuando ya está `Running`.
  - timeouts ajustados en `/webui-ready` y `/webui` para reducir esperas visibles.
- Menos 502 al entrar en Web UI tras onboarding:
  - nueva comprobación técnica `/webui-ready` para validar backend.
  - `/webui` hace fallback a onboarding si el backend aún no responde.
- Onboarding más robusto antes de entrar en Web UI:
  - ahora comprueba que `webui` responde antes de redirigir.
  - añade botón explícito "Abrir Web UI".
- Menos ruido de errores HTTP en arranque:
  - solo se intenta cerrar notificación persistente si antes se creó.
- Fix de redirección final a Web UI:
  - nuevo endpoint `/webui` para proxy directo al backend Tailscale.
  - onboarding redirige a `/webui` al detectar `Running`.
- Fix para Home Assistant Ingress:
  - onboarding usa rutas relativas para evitar errores de carga en iframe (`Estado no disponible`).
- Arranque de Web UI más rápido en Home Assistant:
  - NGINX ya no espera al servicio `web` para iniciar.
  - fallback más agresivo a `/onboarding` con timeouts de proxy más cortos.
- Onboarding más fluido:
  - refresco automático del estado cada 3 segundos.
  - redirección automática a la Web UI cuando Tailscale pasa a `Running`.
- Menos ruido en logs de Taildrop cuando aún no hay almacenamiento disponible.
- Nuevas métricas de tiempo de arranque en logs para diagnóstico fino.
- Web UI más reactiva en primer acceso: timeout corto de proxy y fallback rápido a `/onboarding` si el backend web tarda en responder.
- Arranque inicial más rápido en instalaciones/actualizaciones nuevas:
  - menor espera de `local-network` en startup.
  - timeout de espera de `post-tailscaled` reducido y paso a modo degradado (sin bloquear la Web UI).
- Carga inicial de Web UI más rápida: NGINX ya no espera al backend y muestra onboarding como fallback si el web interno aún no está listo.
- Nueva opción `webui_readonly` para elegir entre Web UI en solo lectura (seguro) o modo con control completo (incluye logout).
- Nuevo onboarding sin logs: página `/onboarding` con URL de login, botón copiar y abrir enlace.
- Notificación persistente en Home Assistant cuando el estado es `NeedsLogin`/`NeedsMachineAuth`.
- Ajuste del proxy de Ingress para la Web UI con redirección segura fuera del iframe de Home Assistant.
- Mejoras de estabilidad en arranque y diagnóstico de estado.
- Comprobación de integridad (SHA256) del binario de Tailscale en build.
- Mejora de CI para validar scripts y build multi-arquitectura.

Estrategia de versionado a partir de esta versión:
- `X`: cambios mayores.
- `Y`: nuevas versiones de Tailscale integradas.
- `Z`: correcciones de errores y mejoras básicas.

---

## Prerrequisitos

Necesitas una cuenta de Tailscale.

Es gratuita para uso personal/hobby (hasta 100 dispositivos en una cuenta). Puedes registrarte con Google, Microsoft o GitHub aquí:

https://login.tailscale.com/start

También puedes crear la cuenta durante el proceso de autenticación de la aplicación.

---

## Instalación

### A) Añadir el repositorio “Nodalia” en Home Assistant

1. En Home Assistant ve a: **Settings → Apps → Apps Store**
2. Menú (⋮) → **Repositories**
3. Añade este repositorio:

   https://github.com/danielmigueltejedor/apps-nodalia

4. Menú (⋮) → **Reload**
5. Instala la aplicación **Tailscale (Nodalia)**.
6. Inicia la aplicación.
7. Abre el **Web UI** de la aplicación para completar la autenticación.

> **Nota:** algunos navegadores dan problemas en el paso de login; suele ir mejor desde escritorio con Chrome.

Si no aparece directamente el flujo de login, abre:

`/onboarding`

en la Web UI del app. Ahí puedes copiar la URL de login sin revisar logs.

---

## Configuración

Esta aplicación tiene pocas opciones propias.

La mayoría de la configuración de tu red Tailscale se hace desde su panel:

https://login.tailscale.com/

La aplicación puede exponer capacidades como **Exit Node**, y (si tu red lo permite) también puede anunciar rutas a subredes.

> 💡 Recomendación: considera desactivar *key expiry* en el dispositivo de Home Assistant para evitar perder acceso.  
> Más info: https://tailscale.com/kb/1028/key-expiry

Ejemplo rápido recomendado:

```yaml
setup_profile: home_access
log_level: info
share_homeassistant: disabled
taildrop: true
```

> [!NOTE]
> Algunas opciones también aparecen en la Web UI de Tailscale, pero ahí pueden ser “solo lectura”.
> Si las cambias en la Web UI, podrías perder esos cambios al reiniciar la aplicación.

---

## Opciones

### `setup_profile`

Perfil de configuración simplificada para no tener que ajustar todas las opciones manualmente:

- `custom` (por defecto): comportamiento manual, sin sobrescribir tu configuración.
- `home_access`: perfil recomendado para acceso remoto a Home Assistant.
- `subnet_router`: pensado para routing de subredes (acepta rutas y, si `advertise_routes` está vacío, anuncia automáticamente subredes locales).
- `exit_node`: activa el nodo como exit node con ajustes seguros para ese caso.

Si quieres control total, usa `custom`.

Perfil recomendado según caso:

| Caso de uso | Perfil |
| --- | --- |
| Solo acceso remoto a Home Assistant | `home_access` |
| Exponer subredes LAN a la tailnet | `subnet_router` |
| Usar este equipo como salida a Internet | `exit_node` |
| Ajuste manual fino | `custom` |

---

### `accept_dns`

Desactiva MagicDNS en este nodo si te da problemas.

Si no se configura, está habilitado por defecto.

Puede causar problemas si ejecutas Pi-hole o AdGuard Home en la misma máquina.
Si te pasa, desactiva `accept_dns`. Aun así puedes usar MagicDNS en otros dispositivos
configurando `100.100.100.100` como DNS en Pi-hole/AdGuard.

---

### `accept_routes`

Permite aceptar rutas de subred anunciadas por otros nodos de tu tailnet.

Más info: https://tailscale.com/kb/1019/subnets

Si no se configura, está deshabilitado por defecto.

---

### `advertise_exit_node`

Anuncia este dispositivo como **Exit Node**.

Más info: https://tailscale.com/kb/1103/exit-nodes

Si no se configura, está deshabilitado por defecto.

> **Nota:** no puedes anunciar Exit Node y, a la vez, configurar `exit_node` (usar otro exit node).

---

### `advertise_connector`

Anuncia este dispositivo como **App Connector**.

Más info: https://tailscale.com/kb/1281/app-connectors

Si no se configura, está deshabilitado por defecto.

---

### `advertise_routes`

Anuncia rutas hacia subredes (LAN) para que otros dispositivos de tu tailnet las alcancen.

Para desactivar: pon una lista vacía `[]`.

Más info: https://tailscale.com/kb/1019/subnets

Si no se configura, por defecto no anuncia rutas (lista vacía).
Con `setup_profile: subnet_router`, si `advertise_routes` está vacío, se auto-detectan y anuncian subredes locales.

---

### `exit_node`

Define qué nodo Tailscale usar como Exit Node para este dispositivo.

Más info: https://tailscale.com/kb/1103/exit-nodes

No se usa por defecto. Para que aparezca en el editor, activa “Show unused optional configuration options”.

> **Nota:** si defines `exit_node`, `exit-node-allow-lan-access` se habilita siempre en el entorno de HA.

---

### `log_level`

Controla el nivel de logs:

- `trace`
- `debug`
- `info` (recomendado)
- `notice`
- `warning`
- `error`
- `fatal`

Si `log_level` es `info` o menor, la aplicación también opta por no subir logs del cliente a log.tailscale.io.

---

### `login_server`

Control server alternativo (por ejemplo, si usas Headscale).

Por defecto: `https://controlplane.tailscale.com`

---

### `share_homeassistant`

Habilita **Tailscale Serve / Funnel** para presentar Home Assistant con certificado TLS (en tailnet y/o internet).

Opciones:
- `disabled` (por defecto)
- `serve`
- `funnel`

Más info:
- HTTPS: https://tailscale.com/kb/1153/enabling-https
- Serve: https://tailscale.com/kb/1312/serve
- Funnel: https://tailscale.com/kb/1223/funnel

#### Requisito en Home Assistant (trusted proxy)
Si usas Serve/Funnel, añade en tu `configuration.yaml`:

```yaml
http:
  use_x_forwarded_for: true
  trusted_proxies:
    - 127.0.0.1
```

Reinicia Home Assistant tras guardarlo.

---

### `share_on_port`

Puerto usado por Serve/Funnel. Solo válido:
- `443`
- `8443`
- `10000`

Por defecto: `443`

---

### `snat_subnet_routes`

Permite que los dispositivos de la subred vean el tráfico como originado desde el subnet router, simplificando routing.

Si no se configura, está habilitado por defecto.

> **Nota:** desactívalo solo si entiendes bien las implicaciones (site-to-site avanzado).  
> Guía: https://tailscale.com/kb/1214/site-to-site

---

### `stateful_filtering`

Filtrado stateful para nodos que reenvían paquetes (exit nodes, subnet routers, app connectors).

Si no se configura, está deshabilitado por defecto.

---

### `tags`

Tags para este nodo. Deben empezar por `tag:`.

Más info: https://tailscale.com/kb/1068/tags

---

### `taildrop`

Soporta Taildrop para recibir archivos en Home Assistant.

Si no se configura, está habilitado por defecto.

Los archivos recibidos se guardan en `/share/taildrop`.

Más info: https://tailscale.com/kb/1106/taildrop

---

### `userspace_networking`

Usa modo userspace para hacer accesible Home Assistant (y opcionalmente subredes) dentro de tu tailnet.

Si no se configura, está deshabilitado por defecto.

Si necesitas acceder desde Home Assistant a otros clientes de tu tailnet (y resolver por nombre),
puede interesarte desactivar este modo para crear interfaz `tailscale0` en el host y ajustar DNS.

Más info: https://tailscale.com/kb/1112/userspace-networking

---

### `webui_readonly`

Controla si la Web UI embebida se ejecuta en modo solo lectura.

- `true` (por defecto): modo seguro, sin acciones destructivas.
- `false`: habilita control completo en la Web UI (por ejemplo, `logout`).

Recomendación: mantener `true` salvo que necesites gestionar sesión directamente desde la Web UI.

---

## Network

### Puerto: `41641/udp`

Puerto UDP para WireGuard/peer-to-peer.

Si notas que no se establecen conexiones P2P (CGNAT, etc.), puedes usar este puerto y hacer port-forwarding.
Prueba con:

`tailscale ping <hostname-or-ip>`

---

## Soporte

- Home Assistant Community Add-ons Discord
- Home Assistant Discord
- Home Assistant Community Forum
- /r/homeassistant (Reddit)

---

## Licencia

MIT License

Copyright (c) 2021-2025 Franck Nijhof

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
