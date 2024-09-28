
# Requirements

- Docker with buildkit - relatively new version. In my case these are:
```
  docker is         : Docker version 24.0.7, build afdd53b
  docker compose    : Docker Compose version v2.23.3-desktop.2
```

- Ideally, Node [v20.17.0](.nvmrc) should be used for local tinkering. However, it's not necessary if you're only running it via Docker.



# Start & stop

```

docker compose --project-name argylesd --env-file .env up -d 

docker compose --project-name argylesd --env-file .env down 

```

# Endpoints to visit

```

# also in docker-composer.yml uncomment phpmyadmin
# and run 'up' again

http://0.0.0.0:4298/
  # phpmyadmin - ui to manage database

```

# Commands to run - via docker

Because I can't relay on the host environment I've prepared bunch of commands to run via docker explore the rest of the project:

```

# jest tests
docker run -it -v "$(pwd)/:/data" --workdir=/data node:20.17.0-alpine /bin/sh jest.sh
  # that might be unreliable though because we are mounting dependencies from the host
  # it would be better to pull dependencies from inside the container

# or as a build stage - this way test could be executed as a single step in the CI/CD to reuse build stage
docker build --progress=plain --target unit .

# or by building base_stage and running tests using it
docker build -t argylesd:base_stage --target base_stage .
docker run -it --entrypoint="" argylesd:base_stage /bin/sh jest.sh


# explore code coverage
docker run -it -v "$(pwd):/data" --entrypoint="" argylesd:base_stage /bin/sh jest.sh
# then open directly in the browser [coverage/index.html](coverage/index.html) 

# or launch temporary server

export PPORT="5090" && \
  echo -e "\n    http://localhost:${PPORT} \n" && \
  python3 -m http.server ${PPORT} --directory ./coverage

# then visit http://localhost:5090   

# worth mentioning is that due to multistage build final production image excludes "devDependencies"
# to see the gain on the image size run thsese commands:

du -sh node_modules
docker build -t argylesd:image --target image .
docker images argylesd:image

# that's entire image with node itself

# for comparison raw alpine image
docker images node:20.17.0-alpine

# and dependencies inside our final image
docker run -it --entrypoint="" argylesd:image sh -c "du -sh *"

```

# Tools choice


I've used simplest ts configuration to drive node code with express and mysql2 for connectivity to database.

135.5M	node_modules