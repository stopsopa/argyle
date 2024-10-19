# How to run

Enter the 'node' directory using CLI and run

```

# to run
docker compose --project-name argylesd --env-file .env up -d --build mysql fixtures node

# to stop
docker compose --project-name argylesd --env-file .env down

```

then visit in browser

http://localhost:4299

If you wish to understand the structure and way of thinking follow node/README.md
