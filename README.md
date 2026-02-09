# Home Assistant App: Tailscale (Nodalia)

Tailscale es una VPN “zero config” que se instala en minutos, incluyendo tu instancia de Home Assistant.

Crea una red segura entre tus servidores, ordenadores y servicios en la nube.
Incluso separados por firewalls o subredes, Tailscale funciona y gestiona reglas de firewall por ti.

---

## Versión actual

`1.2.7`

Cambios destacados:
- Mejoras de estabilidad en arranque y diagnóstico de estado.
- Comprobación de integridad (SHA256) del binario de Tailscale en build.
- Mejora de CI para validar scripts y build multi-arquitectura.

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

   https://github.com/danielmigueltejedor/addon-tailscale-nodalia

4. Menú (⋮) → **Reload**
5. Instala la aplicación **Tailscale (Nodalia)**.
6. Inicia la aplicación.
7. Abre el **Web UI** de la aplicación para completar la autenticación.

> **Nota:** algunos navegadores dan problemas en el paso de login; suele ir mejor desde escritorio con Chrome.

---

## Configuración

Esta aplicación tiene pocas opciones propias.

La mayoría de la configuración de tu red Tailscale se hace desde su panel:

https://login.tailscale.com/

La aplicación puede exponer capacidades como **Exit Node**, y (si tu red lo permite) también puede anunciar rutas a subredes.

> 💡 Recomendación: considera desactivar *key expiry* en el dispositivo de Home Assistant para evitar perder acceso.  
> Más info: https://tailscale.com/kb/1028/key-expiry

Ejemplo completo:

```yaml
accept_dns: true
accept_routes: true
advertise_exit_node: true
advertise_connector: true
advertise_routes:
  - 192.168.1.0/24
  - fd12:3456:abcd::/64
exit_node: 100.101.102.103
log_level: info
login_server: "https://controlplane.tailscale.com"
share_homeassistant: disabled
share_on_port: 443
snat_subnet_routes: true
stateful_filtering: false
tags:
  - tag:example
  - tag:homeassistant
taildrop: true
userspace_networking: true
```

> [!NOTE]
> Algunas opciones también aparecen en la Web UI de Tailscale, pero ahí pueden ser “solo lectura”.
> Si las cambias en la Web UI, podrías perder esos cambios al reiniciar la aplicación.

---

## Opciones

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

Si no se configura, está habilitado por defecto.

---

### `advertise_exit_node`

Anuncia este dispositivo como **Exit Node**.

Más info: https://tailscale.com/kb/1103/exit-nodes

Si no se configura, está habilitado por defecto.

> **Nota:** no puedes anunciar Exit Node y, a la vez, configurar `exit_node` (usar otro exit node).

---

### `advertise_connector`

Anuncia este dispositivo como **App Connector**.

Más info: https://tailscale.com/kb/1281/app-connectors

Si no se configura, está habilitado por defecto.

---

### `advertise_routes`

Anuncia rutas hacia subredes (LAN) para que otros dispositivos de tu tailnet las alcancen.

Para desactivar: pon una lista vacía `[]`.

Más info: https://tailscale.com/kb/1019/subnets

Si no se configura, por defecto la aplicación puede anunciar rutas a tus subredes en interfaces soportadas (según el entorno de red de Supervisor).

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

Si no se configura, está habilitado por defecto.

Si necesitas acceder desde Home Assistant a otros clientes de tu tailnet (y resolver por nombre),
puede interesarte desactivar este modo para crear interfaz `tailscale0` en el host y ajustar DNS.

Más info: https://tailscale.com/kb/1112/userspace-networking

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
