<!-- .github/copilot-instructions.md - Guidance for AI coding agents working on n2_pipeline_forgejo -->

This repository runs a single Forgejo (Gitea fork) instance in Docker and keeps all persistent data under `./forgejo`.

Key facts (read before changing anything)
- Main service is defined in `docker-compose.yml`: image `codeberg.org/forgejo/forgejo:13` with `./forgejo` mounted to `/data` inside the container.
- Web UI: http://localhost:3000 (container HTTP_PORT=3000). Host SSH for repos is exposed on host port 222 -> container 22.
- App config: `forgejo/gitea/conf/app.ini` — this is the live configuration persisted in the repo.
- Repositories and uploads are persisted under `./forgejo` (map to `/data` in container):
  - Repos: `/data/git/repositories` (host: `forgejo/git`)
  - Avatars: `/data/gitea/avatars` (host: `forgejo/gitea/avatars`)
  - Sessions, indexers, LFS, queues and jwt keys are present in `forgejo/`.

Project-specific rules for code changes
- Treat files under `forgejo/` as live container state. Editing `forgejo/gitea/conf/app.ini` or replacing keys will affect the running instance and may require container restart.
- Do not commit secrets or private keys to public branches. This repo currently contains `forgejo/jwt/private.pem` and other tokens inside `app.ini` — do not copy or exfiltrate them when making edits.
- If you need to change service ports or volumes, prefer editing `docker-compose.yml`. Use the compose file as the single source of truth (the top-level README contains a small typo for the image registry; prefer `docker-compose.yml`).

How to build, run and validate (developer workflows)
- Start the service (Docker Desktop must be running):

```zsh
docker-compose pull
docker-compose up -d
```

- Stop and remove containers:

```zsh
docker-compose down
```

- Restart after config changes (edit `forgejo/gitea/conf/app.ini` then):

```zsh
docker-compose restart server
```

- Access checks after changes: open `http://localhost:3000` and verify repos appear or use `ssh -p 222 git@localhost` to test SSH access.

Where CI / pipelines live
- This repo expects Forgejo Actions workflows under `.forgejo/workflows/` (see README). A runner must be registered separately (link referenced in README). To add a pipeline create `.forgejo/workflows/<name>.yaml`.

Notable repository conventions and patterns
- Persistent container state is intentionally stored in-tree under `./forgejo` for easy backups and local testing. Treat that directory as application data, not source code.
- UID/GID are set through env in `docker-compose.yml` (USER_UID=1000, USER_GID=1000). Preserve ownership when creating files in `forgejo/` so the container can read/write them.
- The container runs in `RUN_MODE = prod` and `OFFLINE_MODE = true` in `app.ini`. Expect limited outbound network integrations.

Integration points and quick navigation
- `docker-compose.yml` — service definition, volumes, ports (first source to check when troubleshooting).
- `forgejo/gitea/conf/app.ini` — primary app config (auth, paths, ports, tokens).
- `forgejo/git/` — git repositories stored on host (mapped to container `/data/git`).
- `forgejo/ssh/` — SSH host keys used by the container (changing these will rotate SSH fingerprints).

Typical change contract for configuration edits
- Input: edit `forgejo/gitea/conf/app.ini` or `docker-compose.yml`.
- Action: restart container with `docker-compose restart server` (or `up -d` if replacing image).
- Output: web UI reachable on `http://localhost:3000`, SSH on port `222`.

Edge cases and gotchas
- README contains a typoed image registry (`codeberd.org`); use the image from `docker-compose.yml`.
- INSTALL_LOCK = true in `app.ini` means the instance is considered installed; some setup pages may be disabled.
- Because data is in-repo, avoid large binary commits in `forgejo/` (avatars, lfs files) — prefer using external backups or .gitignore if adding generated dumps.

If you need more context
- Open `docker-compose.yml`, `forgejo/gitea/conf/app.ini` and inspect `forgejo/` subfolders listed above.
- If you plan to add workflows, check the README steps under "Criando pipeline" and register a Forgejo Runner following the official docs.

Questions or missing details
- If anything above is wrong (e.g., different service name or additional services), tell me which files to inspect and I will update this guidance.
