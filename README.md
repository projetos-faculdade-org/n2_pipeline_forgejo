# Como rodar

## O que usamos


## Como fazer

### Instalação Forgejo
1. Abra o Docker Desktop
2. Na linha de comando: `docker pull codeberd.org/forgejo/forgejo:13`
3. Copiar o exemplo de arquivo que está na documentação (https://forgejo.org/docs/latest/admin/installation/docker/#docker) e salve como `docker-compose.yml`
4. Em um terminal, vá ao diretório onde está o arquivo docker e rode o comando `docker-compose up -d` para iniciar o contêiner.
5. Uma vez iniciado, pode ser acessado a partir da porta que definiu (nesse caso, `http://localhost:3000/`)
6. Defina nome e usuário de administrador

Nota: deixar as configurações padrão por enquanto. Para parar, use `docker-compose down`

### Criando pipeline

Antes de tudo, instale Forgejo Runner (link: `https://forgejo.org/docs/latest/admin/actions/runner-installation/`)

1. na raiz do projeto, criar `.forgejo/workflows/build-docker.yaml`
2. Dentro desse arquivo, definir o que o pipeline deve fazer.
3. Para definir um runner
```markdown
# Como rodar

## O que usamos

- Docker Desktop
- Forgejo

## Como fazer

### Instalação Forgejo
1. Abra o Docker Desktop
2. Na linha de comando: `docker pull codeberg.org/forgejo/forgejo:13`
3. Copiar o exemplo de arquivo que está na documentação (https://forgejo.org/docs/latest/admin/installation/docker/#docker) e salve como `docker-compose.yml`
4. Em um terminal, vá ao diretório onde está o arquivo docker e rode o comando `docker-compose up -d` para iniciar o contêiner.
5. Uma vez iniciado, pode ser acessado a partir da porta que definiu (nesse caso, `http://localhost:3000/`)
6. Defina nome e usuário de administrador

Nota: deixar as configurações padrão por enquanto. Para parar, use `docker-compose down`

### Criando pipeline

Antes de tudo, instale Forgejo Runner (link: `https://forgejo.org/docs/latest/admin/actions/runner-installation/`)

1. na raiz do projeto, criar `.forgejo/workflows/build-docker.yaml`
2. Dentro desse arquivo, definir o que o pipeline deve fazer.
3. Para definir um runner

## Quickstart: rodar tudo localmente

Esses passos iniciam o Forgejo, o Registry local, o Runner de deploy e a `mini-api` de exemplo.

1) Iniciar serviços definidos em `docker-compose.yml` (Forgejo + registry)

```zsh
docker-compose pull
docker-compose up -d
```

2) Verificar containers (deve mostrar `forgejo` e `registry` com portas expostas)

```zsh
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"
```

3) Iniciar o runner de deploy (webhook listener)

```zsh
cd runner
npm install
DEPLOY_SECRET=your-secret REPO_PATH=$(pwd)/.. PORT=4000 nohup npm start > /tmp/runner.log 2>&1 &
tail -f /tmp/runner.log
```

4) Opcional: rodar a `mini-api` localmente (ou deixe o runner fazê-lo após o push)

```zsh
cd mini-api
npm install
nohup npm start > /tmp/mini-api.log 2>&1 &
curl http://localhost:3001/health
```

5) Configurar webhook no Forgejo

- Payload URL: `http://<runner-host>:4000/webhook`
- Method: POST
- Header: `x-deploy-secret: your-secret`
- Events: push

Quando um push for recebido o runner executará `git pull` no repositório e em seguida `docker-compose up -d --build`.

6) Para usar o registry local (opcional)

```zsh
# taguear e enviar uma imagem exemplo
docker tag myimage:latest localhost:5001/myimage:latest
docker push localhost:5001/myimage:latest
```

Parar tudo

```zsh
# para serviços docker
docker-compose down
# parar runner e mini-api (procure pelos PID ou use nohup logs)
pkill -f "node src/index.js" || true
pkill -f "node src/index.js" || true
```

## Usando o Registry Local

O registry Docker local está disponível em `localhost:5001`. Para usar:

### Verificar status

```zsh
# Ver se o registry está rodando (deve mostrar 0.0.0.0:5001->5000/tcp)
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}" | grep registry
```

### Push/Pull de imagens

```zsh
# Exemplo com a mini-api
cd mini-api
docker build -t mini-api:latest .

# Tag para registry local (porta 5001)
docker tag mini-api:latest localhost:5001/mini-api:latest

# Push para registry
docker push localhost:5001/mini-api:latest

# Testar pull
docker pull localhost:5001/mini-api:latest
```

### Ver imagens no registry

```zsh
# Listar todas as imagens
curl -X GET http://localhost:5001/v2/_catalog

# Ver tags de uma imagem específica (exemplo: mini-api)
curl -X GET http://localhost:5001/v2/mini-api/tags/list
```

### Usar no docker-compose

Para usar uma imagem do registry local em outro serviço:

```yaml
services:
  myapp:
    image: localhost:5001/mini-api:latest
    ports:
      - "3001:3001"
```
