# Home Assistant App: Nodalia Connect (BETA)

Tailscale es una VPN “zero config” que se instala en minutos, incluyendo tu instancia de Home Assistant.

Crea una red segura entre tus servidores, ordenadores y servicios en la nube.
Incluso separados por firewalls o subredes, Tailscale funciona y gestiona reglas de firewall por ti.

---

## Versión actual

`3.0.1-rc3`

Cambios destacados (resumen de cambios recientes):
- Flujo de Web UI por ingress estabilizado:
  - el botón `Entrar Web UI (ingress)` abre la raíz real del ingress (`.../`) y evita el `Page not found`.
  - normalización de rutas para soportar correctamente URLs con y sin slash final.
  - verificación de disponibilidad de Web UI más robusta para evitar falsos bloqueos.
- Onboarding más predecible:
  - detección de estado basada en señales runtime + preflight real de ingress.
  - auto-entrada a Web UI desactivada por defecto (activable desde el panel).
  - feedback de estado y diagnóstico en vivo mantenido en una sola pantalla.
- `Logauth` local reforzado:
  - el flujo de logout pasa a reset local de identidad (`logauth`) sin depender de token API de tailnet.
  - doble confirmación en UI con feedback visual claro (estado armado, cuenta atrás y resultado).
  - mejora de compatibilidad de llamadas de control (`POST` con fallback a `GET` cuando aplica).
  - ingress: rutas tipo `/control-api/logout` se traducen internamente a query string para evitar setups que descartan `QUERY_STRING`/`PATH_INFO`.
  - el botón power prueba primero `POST /control-api` con `action=logout` en body y mantiene fallbacks, para no depender de una sola vía de enrutado.
  - fallback definitivo: rutas de acción apuntan a CGI dedicados por nombre (`control-logout`, etc.), sin depender de variables CGI que algunos entornos no propagan.
- Soporte Nodalia orientado a acceso local:
  - el botón de soporte deja de depender de túnel Cloudflare y controla directamente un usuario local de Home Assistant.
  - lookup de usuario endurecido (primero `core/api/config/users`, fallback `auth/list`) para evitar falsos `ha_users_api_error`.
  - modo soporte único: `virtual-keys` (crea/revoca token temporal y devuelve login URL temporal).
  - nueva ventana temporal con TTL, auditoría y elegibilidad por DNS de tailnet (`support_tailnet_dns_suffix`).
  - el usuario de soporte se define en `support_user` (por defecto `nodalia`).
  - nuevo endpoint y botón `Debug soporte` para capturar causa técnica real (`reason`, `lookup_source`, `lookup_reason`, usuario/ID/login y último error API) y facilitar soporte.
- UI beta renovada:
  - tema oscuro por defecto.
  - selector claro/oscuro en modo icon-only (`☀`/`🌙`).
  - limpieza de acciones redundantes en onboarding (se elimina `Control rapido`).
  - UX de `Logauth` más limpia:
    - tras éxito muestra estado corto (`Desconectado • listo para nueva tailnet`).
    - las trazas técnicas de logout solo se muestran en modo avanzado.
    - al confirmar reset se recarga automáticamente el panel para reflejar inmediatamente el estado desconectado.
    - si el nodo ya está desconectado, el botón power muestra aviso y no vuelve a ejecutar reset innecesario.

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
5. Instala la aplicación **Nodalia Connect (BETA)**.
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
- `false`: habilita control completo de tailnet en la Web UI (por ejemplo, gestionar sesión desde la propia Web UI).

Recomendación: mantener `true` salvo que necesites gestionar tailnet directamente desde la Web UI.
El panel `/onboarding` mantiene controles locales de máquina (como `logauth`) incluso en modo readonly.

---

### `support_tunnel_enabled`

Activa el módulo de acceso temporal de soporte Nodalia.

- `false` (por defecto): desactivado.
- `true`: habilitado, sujeto a elegibilidad de DNS/configuración.

---

### `support_tailnet_dns_suffix`

Sufijo DNS de la tailnet autorizada para soporte remoto (ejemplo: `tail123456.ts.net`).

La elegibilidad del acceso se valida con este valor.

Por defecto: vacío (si está vacío, el soporte no será elegible hasta configurarlo).

---

### `support_user`

Usuario local de soporte (por defecto: `nodalia`).

Se usa como usuario base para crear/revocar tokens temporales en `virtual-keys`.

Recomendación: que sea un usuario local dedicado de soporte (no owner).
Para crearlo: `Ajustes -> Personas -> Usuarios -> Añadir usuario`.

---

### `support_virtual_keys_token_prefix`

Prefijo del nombre del token temporal creado con virtual-keys.

Por defecto: `nodalia_support_key`.

---

### `support_target_url`

Base URL pública opcional para construir el enlace de acceso de soporte en modo `virtual-keys`.

Ejemplo: `https://homeassistant.getnodalia.com`

Si está vacío, el aplicación intentará construirla automáticamente como:
`https://<hostname>.<support_target_domain_suffix>`.

Nota:
- Si defines una URL local (`http://127.0.0.1`, `http://localhost`, `http://0.0.0.0`), se ignora automáticamente para evitar enlaces no accesibles desde soporte externo.

---

### `support_target_domain_suffix`

Sufijo de dominio público usado para construir URL externa automática de soporte.

Ejemplo: con `hostname=homeassistant` y `support_target_domain_suffix=getnodalia.com`,
se genera `https://homeassistant.getnodalia.com`.

Por defecto: `getnodalia.com`.

---

### `support_notify_telegram_enabled`

Habilita envío automático por Telegram del enlace temporal de soporte al crear token (`virtual-keys`).

- `false` (por defecto): no envía notificación.
- `true`: envía mensaje con `HostName`, token, TTL y URL de acceso.

---

### `support_notify_telegram_bot_token`

Token del bot de Telegram usado para enviar el mensaje.

Formato esperado: token de BotFather, por ejemplo `123456789:AA...`.

---

### `support_notify_telegram_chat_id`

Chat ID de destino en Telegram (usuario, grupo o canal).

Ejemplos: `123456789`, `-1001234567890`.
También acepta `@canal` o enlaces `t.me/canal` (el app los normaliza automáticamente).

Nota: desde el panel de soporte puedes usar el botón `Probar Telegram` para validar bot + chat_id sin crear un nuevo token de acceso.

---

### `support_tunnel_ttl_minutes`

Tiempo de vida (TTL) del acceso temporal de soporte en minutos.

Rango permitido: `5` a `180`.
Por defecto: `30`.

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
