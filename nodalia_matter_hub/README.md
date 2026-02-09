# Home Assistant App: Nodalia Matter Hub

Nodalia Matter Hub es una **App para Home Assistant** que actúa como **bridge Matter**: publica entidades de Home Assistant
como dispositivos Matter para que puedan ser controladas desde **Apple Home, Google Home, Alexa, SmartThings**, etc.

El objetivo es tener integración **local**, rápida y sin abrir puertos, y además permitir casos “pro” como **traducir dispositivos
no-Matter (por ejemplo un Roborock) a un Vacuum Matter completo con habitaciones**.

---

## Estado del proyecto

> [!IMPORTANT]
> ✅ **Proyecto activo (fork mantenido por Nodalia)**
>
> Este repositorio parte del proyecto original “Home-Assistant-Matter-Hub”.
> A partir de **febrero de 2026**, Nodalia continúa el desarrollo con:
>
> - ✅ Actualizaciones para compatibilidad con versiones recientes de Matter
> - ✅ Corrección de bugs y mejoras de estabilidad
> - ✅ Roadmap “pro” (Vacuum con habitaciones / Service Area, bridges dedicados, etc.)
>
> ⚠️ Nota: si usas “Vacuum Matter con habitaciones” en Apple Home, se recomienda un **bridge dedicado solo para el vacuum**
> para evitar comportamientos extraños en algunos controladores.

---

## Qué hace (y qué no)

### ✅ Hace
- Publica entidades de Home Assistant como dispositivos Matter
- Empareja con controladores Matter (Apple Home / Google Home / etc.) por comunicación local
- Permite organizar tus dispositivos por “bridges” (por ejemplo, separar vacuums del resto)

### ⚠️ Limitaciones
- Matter no estandariza al 100% todas las funciones “avanzadas” de todos los dispositivos.
- Algunas capacidades dependen del controlador (por ejemplo, Apple Home vs Google Home).
- La exposición de “habitaciones” para un robot requiere modelado correcto de **Service Area** y mapping estable.

---

## Prerrequisitos

- Home Assistant OS / Supervised (con soporte de **Apps**)
- Un controlador Matter en la misma red:
  - Apple Home (HomePod / Apple TV como hub)
  - Google Home
  - Alexa / SmartThings (según compatibilidad Matter)
- Home Assistant accesible desde la App (misma LAN)

> 💡 Recomendación: usa IP fija o DHCP reservation para Home Assistant y para el host donde corra la App.

---

## Instalación

### A) Añadir el repositorio “Nodalia” en Home Assistant

1. En Home Assistant ve a: **Settings → Apps**
2. **App Store** → Menú (⋮) → **Repositories**
3. Añade este repositorio:

   `https://github.com/danielmigueltejedor/nodalia-matter-hub`

4. Menú (⋮) → **Reload**
5. Instala la App **Nodalia Matter Hub**
6. Inicia la App

---

## Configuración

La App se configura principalmente desde su **Web UI**.

1. Abre la App → **Open Web UI**
2. Conecta con Home Assistant (token)
3. Selecciona qué entidades quieres publicar por Matter
4. Crea el bridge y empareja desde el controlador Matter (Apple/Google/Alexa)

> [!NOTE]
> Se recomienda crear bridges separados por “clase de dispositivos”:
> - Bridge “Casa” (luces, enchufes, sensores…)
> - Bridge “Robots” (vacuum/s)
>
> Especialmente para Apple Home, un bridge dedicado al vacuum suele dar mejor estabilidad.

---

## Emparejar con Apple Home (ejemplo)

1. En la Web UI de Nodalia Matter Hub, abre el bridge y genera un **código de emparejamiento Matter**
2. En iPhone: **Casa → + → Añadir accesorio**
3. Escanea el código o introduce el código manualmente
4. Asigna habitación y nombre

---

## Vacuum Matter con habitaciones (modo PRO)

Esta App puede exponer un robot **no-Matter** (por ejemplo Roborock integrado en Home Assistant)
como un **Robotic Vacuum Cleaner Matter** completo, incluyendo “habitaciones”, usando:

- Cluster: **Robotic Vacuum Cleaner**
- Cluster: **Service Area** (habitaciones / selección de áreas)

### Cómo funciona
1. Nodalia Matter Hub publica el Vacuum Matter hacia Apple Home.
2. Apple Home muestra habitaciones (Service Area).
3. Cuando eliges habitaciones y empiezas limpieza, la App traduce:
   - Selección de áreas Matter → IDs internos (mapping estable)
   - Start/Clean → servicio/command en Home Assistant (segment clean, etc.)

### Mapping de habitaciones
Para que Apple vea “Cocina / Salón / Pasillo”, la App necesita un mapping estable entre:
- **Matter Area ID** ↔ **Segment ID del robot** ↔ **Nombre**

Ejemplo (conceptual):
- Cocina: Matter ID 1 → Segment 16
- Salón: Matter ID 2 → Segment 17

> 💡 Si quieres que el mapping sea automático, lo ideal es obtenerlo desde la integración del robot
> (cuando sea posible). Si no, se define manualmente desde la Web UI.

---

## Red y puertos

La App usa comunicación local (mDNS/IPv6/UDP) típica de Matter.

### Recomendación de red
- Evita aislar el host en VLANs sin mDNS/Bonjour si quieres emparejar desde iPhone.
- Si usas VLANs, asegúrate de reenviar mDNS entre VLANs (Avahi / mDNS repeater).

---

## Seguridad

- No expone puertos a internet por defecto.
- El emparejamiento Matter se hace en local.
- Los tokens de Home Assistant se almacenan de forma segura dentro de la App.

> ⚠️ Cuidado: no compartas logs que incluyan tokens o códigos de emparejamiento.

---

## Troubleshooting

### No aparece al emparejar
- Verifica que iPhone y Home Assistant están en la misma red
- Revisa mDNS:
  - Router/VLAN bloqueando Bonjour
- Reinicia el bridge y vuelve a generar código

### Apple Home se comporta raro con el vacuum
- Crea un **bridge dedicado** solo para el vacuum
- Empareja ese bridge por separado

### Logs
- Abre la App → **Logs**
- Busca errores de mDNS, commissioning, o conexión a Home Assistant

---

## Soporte

- Home Assistant Community Forum
- Home Assistant Discord
- /r/homeassistant (Reddit)

Nodalia: soporte “best effort” (y documentación en el repo).

---

## Licencia

MIT License

Basado en el trabajo original “Home-Assistant-Matter-Hub” y mantenido como fork por Nodalia.