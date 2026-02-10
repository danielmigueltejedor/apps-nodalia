ARG BUILD_FROM
FROM ${BUILD_FROM}

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN apk add --no-cache nodejs npm
RUN npm install -g home-assistant-matter-hub

COPY run.sh /usr/bin/run-matter-hub
RUN chmod +x /usr/bin/run-matter-hub

CMD ["/usr/bin/run-matter-hub"]
