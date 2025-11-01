# Como rodar

## O que usamos

- Docker Desktop
- Forgejo

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
