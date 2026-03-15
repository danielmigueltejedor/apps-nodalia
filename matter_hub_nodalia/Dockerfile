ARG BUILD_FROM
FROM ${BUILD_FROM}
ARG BUILD_VERSION

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN apk add --no-cache nodejs npm
RUN npm install -g pnpm@10.28.1

WORKDIR /tmp/home-assistant-matter-hub
COPY upstream/ ./
COPY README.md ./README.md
RUN [ -f LICENSE ] || printf "Apache-2.0\n" > LICENSE
ENV APP_VERSION=${BUILD_VERSION}

RUN pnpm install --frozen-lockfile \
  && pnpm --filter './packages/*' run build \
  && pnpm --filter home-assistant-matter-hub run build \
  && pnpm --filter home-assistant-matter-hub run bundle \
  && npm install -g ./apps/home-assistant-matter-hub/package.tgz

WORKDIR /
RUN rm -rf /tmp/home-assistant-matter-hub

COPY run.sh /usr/bin/run-matter-hub
RUN chmod +x /usr/bin/run-matter-hub

CMD ["/usr/bin/run-matter-hub"]
