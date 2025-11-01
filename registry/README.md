Local Docker Registry for this repo

This repository includes a lightweight local Docker registry service (image: `registry:2`) declared in `docker-compose.yml` and mounted to `./registry` on the host.

How to start:

```zsh
# Start just the registry service
docker-compose up -d registry
```

Push an image (example):

```zsh
# Tag an image and push to local registry
docker tag myimage:latest localhost:5000/myimage:latest
docker push localhost:5000/myimage:latest
```

Pull an image from local registry:

```zsh
docker pull localhost:5000/myimage:latest
```

Notes:
- Data is persisted under `./registry`.
- For a production-ready registry, configure TLS and authentication. This local setup is intended for local development only.
