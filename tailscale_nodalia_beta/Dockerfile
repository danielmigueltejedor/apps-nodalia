ARG BUILD_FROM=ghcr.io/hassio-addons/base/amd64:19.0.0
# hadolint ignore=DL3006
FROM ${BUILD_FROM}

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

ARG BUILD_ARCH=amd64
ARG TAILSCALE_VERSION="1.94.1"
ARG TAILSCALE_REPO="https://pkgs.tailscale.com/stable"
ARG CLOUDFLARED_REPO="https://github.com/cloudflare/cloudflared/releases/latest/download"

RUN \
  apk add --no-cache \
    busybox-extras \
    ethtool \
    ipcalc \
    iproute2 \
    iptables \
    nginx \
    curl \
    coreutils \
    networkmanager \
    python3 \
    py3-websockets \
  && ln -sf /sbin/xtables-nft-multi /sbin/ip6tables \
  && ln -sf /sbin/xtables-nft-multi /sbin/iptables \
  && if [ "${BUILD_ARCH}" = "aarch64" ]; then ARCH="arm64"; fi \
  && if [ "${BUILD_ARCH}" = "amd64" ]; then ARCH="amd64"; fi \
  && TS_PKG="tailscale_${TAILSCALE_VERSION#v}_${ARCH}.tgz" \
  && curl --fail --show-error --silent --location \
    "${TAILSCALE_REPO}/${TS_PKG}" \
    --output "/tmp/${TS_PKG}" \
  && curl --fail --show-error --silent --location \
    "${TAILSCALE_REPO}/${TS_PKG}.sha256" \
    --output "/tmp/${TS_PKG}.sha256" \
  && if grep -Eq "[[:space:]]${TS_PKG}$" "/tmp/${TS_PKG}.sha256"; then \
      (cd /tmp && sha256sum -c "${TS_PKG}.sha256"); \
    else \
      echo "$(cat "/tmp/${TS_PKG}.sha256")  /tmp/${TS_PKG}" | sha256sum -c -; \
    fi \
  && tar zxvf "/tmp/${TS_PKG}" -C /opt/ --strip-components 1 \
  && rm -f "/tmp/${TS_PKG}" "/tmp/${TS_PKG}.sha256" \
  && if [ "${BUILD_ARCH}" = "aarch64" ]; then CF_ARCH="arm64"; fi \
  && if [ "${BUILD_ARCH}" = "amd64" ]; then CF_ARCH="amd64"; fi \
  && curl --fail --show-error --silent --location \
    "${CLOUDFLARED_REPO}/cloudflared-linux-${CF_ARCH}" \
    --output /usr/bin/cloudflared \
  && chmod 0755 /usr/bin/cloudflared \
  && rm -rf /opt/systemd

# Copy root filesystem
COPY rootfs /

# ✅ FIX seguro: solo scripts de la aplicación (NO tocar /usr/bin del sistema base)
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
  chmod 0755 /usr/bin/subnet-routes 2>/dev/null || true; \
  chmod 0755 /usr/bin/support-tunnel 2>/dev/null || true; \
  chmod 0755 /usr/bin/ha-virtual-keys 2>/dev/null || true; \
  chmod 0755 /etc/support-api/cgi-bin/support 2>/dev/null || true; \
  chmod 0755 /etc/support-api/cgi-bin/control 2>/dev/null || true

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
