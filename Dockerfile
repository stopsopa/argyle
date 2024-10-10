FROM node:20.17.0-alpine AS base_stage
RUN npm install -g pnpm
USER node:node
WORKDIR /usr/src/app

# COPY --chown=node:node ../../package.json ../../yarn.lock ./
# RUN yarn install --frozen-lockfile --production=false && yarn cache clean 
# I've used yarn but for some reason it was very slow in node:20.17.0-alpine

COPY --chown=node:node ../../package.json ../../pnpm-lock.yaml ./
RUN ls -la *.yaml
RUN pnpm install --shamefully-hoist --frozen-lockfile --production=false && pnpm cache clean

COPY --chown=node:node . .
ENTRYPOINT echo "base_stage Dockerfile stage"

FROM base_stage AS build
RUN NODE_ENV="production" /bin/sh shell/vite.sh npm run build && \
    NODE_ENV="production" /bin/sh shell/build.sh
ENTRYPOINT echo "build Dockerfile stage"

FROM base_stage AS eslint
RUN npx eslint
ENTRYPOINT npx eslint

FROM base_stage AS jest
RUN npx jest
ENTRYPOINT npx jest

FROM node:20.17.0-alpine AS image
RUN npm install -g pnpm
USER node:node
WORKDIR /usr/src/app

# COPY --chown=node:node ./package.json ./yarn.lock ./
# RUN yarn install --frozen-lockfile --production=true && yarn cache clean
# I've used yarn but for some reason it was very slow in node:20.17.0-alpine

COPY --chown=node:node ../../package.json ../../pnpm-lock.yaml ./
RUN pnpm install --shamefully-hoist --frozen-lockfile --production=true && pnpm cache clean

COPY --chown=node:node --from=build /usr/src/app/.env ./.env
COPY --chown=node:node --from=build /usr/src/app/package.json ./package.json
COPY --chown=node:node --from=build /usr/src/app/vite ./vite
COPY --chown=node:node --from=build /usr/src/app/build ./build
HEALTHCHECK --interval=10m --timeout=10s --retries=3 --start-period=10s \
  CMD node -e "fetch('http://localhost:${NODE_PORT}/api/healthcheck', { signal: AbortSignal.timeout(1000) }).then(res => process.exit(res.ok ? 0 : 1)).catch(() => process.exit(1));"
ENTRYPOINT node build/index.js

