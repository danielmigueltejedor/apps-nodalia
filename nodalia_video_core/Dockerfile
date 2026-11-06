ARG BUILD_FROM=ghcr.io/hassio-addons/base/amd64:19.0.0
# hadolint ignore=DL3006
FROM ${BUILD_FROM} # NOSONAR - HA add-ons require root for s6-overlay

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

ARG BUILD_ARCH=amd64
ARG GO2RTC_VERSION="1.9.9"

RUN \
  apk add --no-cache \
    bash \
    ca-certificates \
    curl \
    ffmpeg \
    python3 \
    py3-pip \
    py3-virtualenv \
  && if [ "${BUILD_ARCH}" = "aarch64" ]; then GO2RTC_ARCH="arm64"; fi \
  && if [ "${BUILD_ARCH}" = "amd64" ]; then GO2RTC_ARCH="amd64"; fi \
  && if [ "${BUILD_ARCH}" = "armhf" ]; then GO2RTC_ARCH="armv6"; fi \
  && if [ "${BUILD_ARCH}" = "armv7" ]; then GO2RTC_ARCH="arm"; fi \
  && if [ "${BUILD_ARCH}" = "i386" ]; then GO2RTC_ARCH="i386"; fi \
  && curl --proto "=https" --tlsv1.2 --fail --show-error --silent --location \
    "https://github.com/AlexxIT/go2rtc/releases/download/v${GO2RTC_VERSION}/go2rtc_linux_${GO2RTC_ARCH}" \
    --output /usr/local/bin/go2rtc \
  && chmod 0755 /usr/local/bin/go2rtc \
  && python3 -m venv /opt/nodalia-video-core \
  && /opt/nodalia-video-core/bin/pip install --no-cache-dir --upgrade pip \
  && /opt/nodalia-video-core/bin/pip install --no-cache-dir \
    fastapi \
    httpx \
    pydantic \
    pyyaml \
    uvicorn \
    websockets

COPY app /app/app
COPY run.sh /run.sh
COPY rootfs /

RUN set -eux; \
  chmod 0755 /run.sh; \
  find /etc/services.d -type f -name run -exec chmod 0755 {} \;

ENV PYTHONPATH=/app

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
  org.opencontainers.image.title="${BUILD_NAME}" \
  org.opencontainers.image.description="${BUILD_DESCRIPTION}" \
  org.opencontainers.image.vendor="Nodalia" \
  org.opencontainers.image.authors="Nodalia" \
  org.opencontainers.image.licenses="MIT" \
  org.opencontainers.image.source="https://github.com/${BUILD_REPOSITORY}" \
  org.opencontainers.image.created=${BUILD_DATE} \
  org.opencontainers.image.revision=${BUILD_REF} \
  org.opencontainers.image.version=${BUILD_VERSION}
