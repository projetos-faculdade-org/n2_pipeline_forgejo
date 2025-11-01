# mini-api

Minimal Node + Express API intended for running in a Forgejo Runner as a demo.

Endpoints:
- GET /health – returns JSON status
- POST /echo – echoes posted JSON

Run locally:

```zsh
cd mini-api
npm ci
npm start
```

Health check:

```zsh
curl http://localhost:3001/health
curl -X POST http://localhost:3001/echo -H 'Content-Type: application/json' -d '{"msg":"hi"}'
```
