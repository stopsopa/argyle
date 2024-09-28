
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

# Tools choice


I've used simplest ts configuration to drive node code with express and mysql2 for connectivity to database.

135.5M	node_modules