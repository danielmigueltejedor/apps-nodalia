ARG BUILD_FROM=ghcr.io/hassio-addons/base/amd64:19.0.0
# hadolint ignore=DL3006
FROM ${BUILD_FROM}

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

ARG BUILD_ARCH=amd64
ARG TAILSCALE_VERSION="1.94.1"

RUN \
  apk add --no-cache \
    ethtool=6.14.1-r0 \
    ipcalc=1.0.3-r0 \
    iproute2=6.15.0-r0 \
    iptables=1.8.11-r1 \
    nginx=1.28.0-r3 \
    coreutils=9.7-r1 \
    networkmanager=1.52.1-r0 \
  && ln -sf /sbin/xtables-nft-multi /sbin/ip6tables \
  && ln -sf /sbin/xtables-nft-multi /sbin/iptables \
  && if [ "${BUILD_ARCH}" = "aarch64" ]; then ARCH="arm64"; fi \
  && if [ "${BUILD_ARCH}" = "amd64" ]; then ARCH="amd64"; fi \
  && curl --fail --show-error --silent --location \
    "https://pkgs.tailscale.com/stable/tailscale_${TAILSCALE_VERSION#v}_${ARCH}.tgz" \
     | tar zxvf - -C /opt/ --strip-components 1 \
  && rm -rf /opt/systemd

# Copy root filesystem
COPY rootfs /

# ✅ FIX seguro: solo scripts del add-on (NO tocar /usr/bin del sistema base)
RUN set -eux; \
  \
  # Normaliza CRLF SOLO en scripts típicos de add-ons
  find /etc/s6-overlay -type f \( -name "run" -o -name "*.sh" \) -exec sed -i 's/\r$//' {} \; 2>/dev/null || true; \
  find /etc/cont-init.d -type f -exec sed -i 's/\r$//' {} \; 2>/dev/null || true; \
  find /etc/services.d -type f \( -name "run" -o -name "finish" \) -exec sed -i 's/\r$//' {} \; 2>/dev/null || true; \
  \
  # Permisos ejecutables de s6
  chmod 0755 /etc/s6-overlay/scripts/stage2_hook.sh 2>/dev/null || true; \
  find /etc/s6-overlay/s6-rc.d -type f -name run -exec chmod 0755 {} \; 2>/dev/null || true; \
  find /etc/cont-init.d -type f -exec chmod 0755 {} \; 2>/dev/null || true; \
  find /etc/services.d -type f -name run -exec chmod 0755 {} \; 2>/dev/null || true; \
  \
  # Permisos de scripts propios si existen (ajusta nombres si los tienes)
  chmod 0755 /usr/bin/subnet-routes 2>/dev/null || true

HEALTHCHECK CMD healthcheck

ENV S6_STAGE2_HOOK=/etc/s6-overlay/scripts/stage2_hook.sh

ARG BUILD_DATE
ARG BUILD_DESCRIPTION
ARG BUILD_NAME
ARG BUILD_REF
ARG BUILD_REPOSITORY
ARG BUILD_VERSION

LABEL \
  io.hass.name="${BUILD_NAME}" \
  io.hass.description="${BUILD_DESCRIPTION}" \
  io.hass.arch="${BUILD_ARCH}" \
  io.hass.type="addon" \
  io.hass.version=${BUILD_VERSION} \
  maintainer="Franck Nijhof <frenck@addons.community>" \
  org.opencontainers.image.title="${BUILD_NAME}" \
  org.opencontainers.image.description="${BUILD_DESCRIPTION}" \
  org.opencontainers.image.vendor="Home Assistant Community Add-ons" \
  org.opencontainers.image.authors="Franck Nijhof <frenck@addons.community>" \
  org.opencontainers.image.licenses="MIT" \
  org.opencontainers.image.url="https://addons.community" \
  org.opencontainers.image.source="https://github.com/${BUILD_REPOSITORY}" \
  org.opencontainers.image.documentation="https://github.com/${BUILD_REPOSITORY}/blob/main/README.md" \
  org.opencontainers.image.created=${BUILD_DATE} \
  org.opencontainers.image.revision=${BUILD_REF} \
  org.opencontainers.image.version=${BUILD_VERSION}
