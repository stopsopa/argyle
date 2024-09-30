FROM node:20.17.0-alpine AS base_stage
USER node:node
WORKDIR /usr/src/app
COPY --chown=node:node ../../package.json ../../yarn.lock ./
RUN yarn install --frozen-lockfile --production=false && yarn cache clean
COPY --chown=node:node . .
ENTRYPOINT echo "base_stage Dockerfile stage"

FROM base_stage AS build
RUN NODE_ENV="production" /bin/sh shell/vite.sh npm run build && \
    NODE_ENV="production" /bin/sh shell/build.sh
ENTRYPOINT echo "build Dockerfile stage"

FROM base_stage AS unit
RUN npx jest
ENTRYPOINT echo "unit Dockerfile stage"

FROM node:20.17.0-alpine AS image
USER node:node
WORKDIR /usr/src/app
COPY --chown=node:node ./package.json ./yarn.lock ./
RUN yarn install --frozen-lockfile --production=true && yarn cache clean
COPY --chown=node:node --from=build /usr/src/app/.env ./.env
COPY --chown=node:node --from=build /usr/src/app/package.json ./package.json
COPY --chown=node:node --from=build /usr/src/app/vite ./vite
COPY --chown=node:node --from=build /usr/src/app/build ./build
ENTRYPOINT node build/index.js

