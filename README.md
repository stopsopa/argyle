# Task

[Task.pdf](Task.pdf)

# Requirements

Docker - relatively new version. In my case these are:

```
docker            : Docker version 24.0.7, build afdd53b
docker compose    : Docker Compose version v2.23.3-desktop.2
```

# Start & stop

```
docker compose --project-name argylesd --env-file .env up -d --build mysql fixtures node

docker compose --project-name argylesd --env-file .env down
```

Observe what docker compose is doing here [docker-compose.yml](docker-compose.yml).

# Endpoints to visit

Node server [http://0.0.0.0:4299](http://0.0.0.0:4299)

Optional:

Composer can be executed with command

```
docker compose --project-name argylesd --env-file .env up -d
```

instead of

```
docker compose --project-name argylesd --env-file .env up -d mysql fixtures node
```

that will not exclude container **phpmyadmin** from docker-compose.yml file.

[PhpMyAdmin](https://www.phpmyadmin.net/) is old but still good web management tool for MySQL.

PHPMyAdmin might be reached via [http://localhost:4298](http://localhost:4298).

# Commands to run - via docker

Because I'm relaying on interviewer machine I can't be sure what is installed there. I've tried then to relay as much as I could on Docker.

So here I've prepared bunch of commands to play with different things:

### jest tests

```
docker run -it -v "$(pwd)/:/data" --workdir=/data node:20.17.0-alpine npx jest
```

That might be unreliable though because we are mounting dependencies from the host.

It would be better to pull dependencies from inside the container.

---

Let's try build stage - this is good example how tests could be executed as one of many multistage steps in the CI/CD to reuse docker cache layers.

```
docker build --progress=plain --target jest .
```

---

... or by creating separate image from particular Dockerfile stage and running tests through that image

```
docker build -t argylesd:base_stage --target base_stage .
docker run -it --entrypoint="" argylesd:base_stage npx jest
```

### explore code coverage

```
docker build -t argylesd:base_stage --target base_stage .
docker run -it -v "$(pwd):/usr/src/app" --entrypoint="" argylesd:base_stage npx jest
```

then open directly in the browser [coverage/index.html](coverage/index.html) ...

...or launch temporary server

```
export PPORT="5090" && \
  echo -e "\n    http://localhost:${PPORT} \n" && \
  python3 -m http.server ${PPORT} --directory ./coverage
```

after that visit http://localhost:5090

# Tools choices overview

I've tried to keep it simple so I've used simplest TS configuration to drive node code with express and [mysql2](https://github.com/sidorares/node-mysql2) for connectivity with database.

For frontend I've used [Vite](https://vitejs.dev/guide/) also to keep it light.

I've moved entire Vite setup to separate directory "vite".

This way I can keep TS setup for server separately from vite.

(Vite is doing something funky with combination of different config files tsconfig.{app|node}.{json|tsbuildinfo}... I would like to stay away from that with my node TS config)

I've added pino library for logging, which outputs each event in json format for further scraping and collecting in elasticsearch. To later analyze with Kibana (Standard toolset these days for working with logs).

[Setup](server/modules/logger.ts) is pretty standard, but can be further configured to any specific format.

I would recommend though sticking to [ECS](https://www.elastic.co/elasticsearch/common-schema) format.

### requirements for local machine

Ideally, Node [v20.17.0](.nvmrc) should be used for local tinkering.

I've also made asumption that all of that will be executed on Mac.

### dev mode

For development mode then it is necessary to run node server locally in watch mode in one terminal (NO TS check):

> [!NOTE]
> docker node container have to be stopped, otherwise: Error: listen EADDRINUSE: address already in use :::4299
>
> At least:
>
> `docker rm -f argylesd_node`

```
npm run server:dev
```

... and Vite in watch mode in another (NO TS check)

```
npm run vite:dev | node node_modules/.bin/pino-pretty
```

Vite is [configured](vite/vite.config.ts) to forward all traffic starting from /api to our node server.

For typechecking during development just relay on IDE support, but if you need to run it from CLI then use that for server:

```
npm run server:check
```

and use build mode for Vite:

```
npm run vite:build
```

.. but IDE support should do, plus triggering pipeline on git push.

### prod mode

Build Vite (TS check):

```
npm run vite:build
```

Build server (TS check):

```
npm run server:build
```

and then frontend and backend is served from node server:

```
npm run server:run
```

### prettier & lint

Entire codebase is autoformatted with prettier with just one settings [changed: printWidth: 120](prettier.config.mjs)

To the repostiory pre-commit event is added using husky to don't allow to commit if code is not formatted properly with prettier or eslint reports any errors.

### mysql

For storing data I've used MySQL, simply because I had decent configuration for docker at hand.

# Extras

### more...

There is more things I would like to do in this project, like:

- add some playwright e2e testing like [here](https://github.com/stopsopa/nlab/actions/runs/11092899081/job/30818505380) for example
- I could introduce some caching in Github Actions here and there, definitely caching node_modules.
- add pagination to UI

but I was limited by time.

I've also tried to configure everything in ESM mode ("type": "module" in package.json) but it seems it is quite hard to make sure all tools will cooperate with it, and more importantly don't interfere with each other. Especially there were problems with Jest and Typescript. Tools seems to not be ready yet regarding that. So I've abandoned this idea.

### prod image size

Worth mentioning is fact that due to multistage build final production image excludes "devDependencies" to see the gain on the image size run following commands.

First lests make sure image is built:

```
docker build -t argylesd:image --target image .
```

let's see size of the image

```
docker images argylesd:image
```

and compare with local dependencies

```
du -sh node_modules
```

... keep in mind final image **argylesd:image** contains our build but also node itself.

but let's for comparison see raw alpine image

```
docker images node:20.17.0-alpine
```

and dependencies inside our final image

```
docker run -it --entrypoint="" argylesd:image sh -c "du -sh *"
```

These numbers should speak for themselves.
