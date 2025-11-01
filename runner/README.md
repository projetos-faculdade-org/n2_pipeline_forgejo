Deployer Runner

Simple webhook listener that executes `git pull` and `docker-compose up -d --build` when it receives a valid push event.

Usage (local):

```zsh
cd runner
npm install
DEPLOY_SECRET=your-secret REPO_PATH=/path/to/repo npm start
```

Configure your Forgejo or GitHub webhook to POST to `http://<runner-host>:4000/webhook` with header `x-deploy-secret: your-secret`.

Security notes:
- This runner is intentionally minimal. Use only on trusted networks or behind a reverse proxy with TLS.
- For production, validate payload signatures and restrict the runner network access.
