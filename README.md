# hotel-management

Este repositório contém um sistema de exemplo para gerenciamento de reservas de hotel com backend em Spring Boot (Maven) e frontend em Angular.

Este README descreve como preparar o ambiente de desenvolvimento, executar a aplicação localmente e rodar os testes (Windows / PowerShell orientado). As instruções também incluem comandos cross-platform quando aplicável.

## Visão geral da árvore relevante

- `backend/hotel-backend` — API Java Spring Boot (Maven).
- `frontend` — cliente Angular (TypeScript, Angular Material).

---

## Pré-requisitos

- Java 17 JDK
- Maven 3.8+ (opcional — o projeto inclui Maven Wrapper)
- Node.js 16+ (recomendado 18 LTS) (v22.11.0 utilizada para o desenvolvimento)
- npm 8+ (vem com Node)
- Git (opcional)

Observação: você não precisa instalar o Maven globalmente — use o wrapper (`mvnw` / `mvnw.cmd`). Para o Angular, se não quiser instalar o `@angular/cli` global, use `npx ng`.

---

## Instalação do Java 17 (JDK)

O projeto requer Java 17 para compilar e executar o backend. Abaixo estão instruções rápidas para Windows e Linux. Depois da instalação, confirme com `java -version` e `javac -version`.

Windows (instalador / winget / Chocolatey)

- Instalar via instalador (recomendado): baixe o JDK 17 de um distribuidor como Eclipse Temurin (https://adoptium.net/) ou Oracle e execute o instalador (ex.: `C:\Program Files\Eclipse Adoptium\jdk-17.x.x`).
- Instalar via Chocolatey (automação): abra PowerShell como Administrador e execute:

```powershell
choco install temurin17 -y
```

- Instalar via winget (Windows 10/11):

```powershell
winget install -e --id Eclipse.Temurin.17
```

- Após instalar, verifique:

```powershell
java -version
javac -version
```

- Definir `JAVA_HOME` (opcional, recomendado):

```powershell
setx JAVA_HOME "C:\\Program Files\\Eclipse Adoptium\\jdk-17.0.x"
setx PATH "%PATH%;%JAVA_HOME%\\bin"
```

Linux (Debian/Ubuntu, Fedora, Arch, SDKMAN)

- Debian / Ubuntu:

```bash
sudo apt update
sudo apt install -y openjdk-17-jdk
```

- Fedora / RHEL / CentOS:

```bash
sudo dnf install -y java-17-openjdk-devel
```

- Arch Linux:

```bash
sudo pacman -Syu jdk17-openjdk
```

- SDKMAN (multi-OS, útil para desenvolvedores que alternam versões):

```bash
curl -s "https://get.sdkman.io" | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"
sdk install java 17.0.x-tem
```

- Após instalar, verifique e defina `JAVA_HOME` (exemplo genérico):

```bash
java -version
javac -version
echo 'export JAVA_HOME=$(dirname $(dirname $(readlink -f $(which java))))' >> ~/.bashrc
echo 'export PATH=$JAVA_HOME/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

Notas

- Prefira OpenJDK/Temurin para desenvolvimento (licença mais simples). Oracle JDK pode exigir permissões/licença adicionais em ambiente comercial.
- Se houver múltiplas versões instaladas, use `update-alternatives` (Linux) ou ajuste `JAVA_HOME`/`PATH` para apontar para a versão 17 desejada.


## Backend (Spring Boot)

Localização: `backend/hotel-backend`

Requisitos adicionais (opcionais): banco de dados PostgreSQL — a aplicação lê as configurações em `src/main/resources/application.properties`. Você pode usar PostgreSQL, apontar para outro DB ou usar configurações de teste/in-memory conforme necessário.

# hotel-management

Este repositório contém um sistema de exemplo para gerenciamento de reservas de hotel com backend em Spring Boot (Maven) e frontend em Angular.

Este README descreve como preparar o ambiente de desenvolvimento, executar a aplicação localmente e rodar os testes (Windows / PowerShell orientado). As instruções também incluem comandos cross-platform quando aplicável.

## Visão geral da árvore relevante

- `backend/hotel-backend` — API Java Spring Boot (Maven).
- `frontend` — cliente Angular (TypeScript, Angular Material).

---

## Pré-requisitos

- Java 17 JDK
- PostgreSQL local
- Maven 3.8+ (opcional — o projeto inclui Maven Wrapper)
- Node.js 16+ (recomendado 18 LTS) (v22.11.0 utilizada para o desenvolvimento)
- npm 8+ (vem com Node)
- Git (opcional)

Observação: você não precisa instalar o Maven globalmente — use o wrapper (`mvnw` / `mvnw.cmd`). Para o Angular, se não quiser instalar o `@angular/cli` global, use `npx ng`.

---

## Instalação do Java 17 (JDK)

O projeto requer Java 17 para compilar e executar o backend. Abaixo estão instruções rápidas para Windows e Linux. Depois da instalação, confirme com `java -version` e `javac -version`.

Windows (instalador / winget / Chocolatey)

- Instalar via instalador (recomendado): baixe o JDK 17 de um distribuidor como Eclipse Temurin (https://adoptium.net/) ou Oracle e execute o instalador (ex.: `C:\Program Files\Eclipse Adoptium\jdk-17.x.x`).
- Instalar via Chocolatey (automação): abra PowerShell como Administrador e execute:

```powershell
choco install temurin17 -y
```

- Instalar via winget (Windows 10/11):

```powershell
winget install -e --id Eclipse.Temurin.17
```

- Após instalar, verifique:

```powershell
java -version
javac -version
```

- Definir `JAVA_HOME` (opcional, recomendado):

```powershell
setx JAVA_HOME "C:\\Program Files\\Eclipse Adoptium\\jdk-17.0.x"
setx PATH "%PATH%;%JAVA_HOME%\\bin"
```

Linux (Debian/Ubuntu, Fedora, Arch, SDKMAN)

- Debian / Ubuntu:

```bash
sudo apt update
sudo apt install -y openjdk-17-jdk
```

- Fedora / RHEL / CentOS:

```bash
sudo dnf install -y java-17-openjdk-devel
```

- Arch Linux:

```bash
sudo pacman -Syu jdk17-openjdk
```

- SDKMAN (multi-OS, útil para desenvolvedores que alternam versões):

```bash
curl -s "https://get.sdkman.io" | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"
sdk install java 17.0.x-tem
```

- Após instalar, verifique e defina `JAVA_HOME` (exemplo genérico):

```bash
java -version
javac -version
echo 'export JAVA_HOME=$(dirname $(dirname $(readlink -f $(which java))))' >> ~/.bashrc
echo 'export PATH=$JAVA_HOME/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

Notas

- Prefira OpenJDK/Temurin para desenvolvimento (licença mais simples). Oracle JDK pode exigir permissões/licença adicionais em ambiente comercial.
- Se houver múltiplas versões instaladas, use `update-alternatives` (Linux) ou ajuste `JAVA_HOME`/`PATH` para apontar para a versão 17 desejada.

### Instalar pgAdmin 4 e rodar PostgreSQL local (Windows e Linux)

Se você quer uma interface gráfica para gerenciar o banco, o pgAdmin 4 é a opção recomendada. A seguir há duas abordagens: (A) instalar PostgreSQL+pgAdmin no Windows via instalador; (B) rodar PostgreSQL em um container Docker e conectar com pgAdmin (local ou em container).

Opção A — instalar PostgreSQL + pgAdmin (Windows)

- Baixe o instalador do PostgreSQL para Windows: https://www.postgresql.org/download/windows/
- Execute o instalador e durante o processo escolha um usuário (normalmente `postgres`) e uma senha (ex.: `admin`).
- Após a instalação abra o pgAdmin 4 (menu Iniciar → pgAdmin 4). Crie um novo Server (clicar com o botão direito em "Servers" → Create → Server...) e configure:
    - General → Name: hotel-local
    - Connection → Host name/address: localhost
    - Port: 5432
    - Maintenance database: postgres
    - Username: postgres
    - Password: (senha escolhida no instalador)

Opção B — rodar PostgreSQL em Docker + (opcional) pgAdmin em Docker

- Levantar o container PostgreSQL (cria o DB `hotel_db` e senha `admin`):

PowerShell:
```powershell
docker run --name hotel-postgres -e POSTGRES_PASSWORD=admin -e POSTGRES_DB=hotel_db -p 5432:5432 -d postgres:16
```

Linux / macOS:
```bash
# se seu Docker requer sudo
sudo docker run --name hotel-postgres -e POSTGRES_PASSWORD=admin -e POSTGRES_DB=hotel_db -p 5432:5432 -d postgres:16

# ou, se preferir, adicione seu usuário ao grupo docker (requer logout/login)
sudo usermod -aG docker $USER
```

- (Opcional) Rodar pgAdmin em container para administrar via browser:

PowerShell:
```powershell
docker run --name hotel-pgadmin -p 8080:80 \
    -e PGADMIN_DEFAULT_EMAIL=admin@local -e PGADMIN_DEFAULT_PASSWORD=admin \
    -d dpage/pgadmin4
```

Linux / macOS:
```bash
sudo docker run --name hotel-pgadmin -p 8080:80 \
  -e PGADMIN_DEFAULT_EMAIL=admin@local -e PGADMIN_DEFAULT_PASSWORD=admin \
  -d dpage/pgadmin4
```

- Acesse pgAdmin em http://localhost:8080 (se tiver usado o container) ou abra o app local e cadastre um novo Server apontando para `localhost:5432` (ou `host.docker.internal` quando estiver conectando de dentro de outro container).

Criar banco/usuário (se necessário)

Se o banco `hotel_db` não existir, crie-o via pgAdmin ou psql:

```sql
CREATE DATABASE hotel_db;
CREATE USER hotel_user WITH PASSWORD 'hotel_pass';
GRANT ALL PRIVILEGES ON DATABASE hotel_db TO hotel_user;
```

Configurar a aplicação para apontar ao banco

- A configuração padrão está em `backend/hotel-backend/src/main/resources/application.properties`. Para sobrescrever localmente via PowerShell, por exemplo:

```powershell
# $env:SPRING_DATASOURCE_URL = 'jdbc:postgresql://localhost:5432/hotel_db'
# $env:SPRING_DATASOURCE_USERNAME = 'postgres'
# $env:SPRING_DATASOURCE_PASSWORD = 'admin'
```

Testar a conexão e iniciar a aplicação

PowerShell:
```powershell
# Verificar se a porta 5432 responde
Test-NetConnection -ComputerName localhost -Port 5432

# Iniciar o backend
cd backend\hotel-backend
.\mvnw.cmd spring-boot:run
```

Linux / macOS:
```bash
# Verificar se a porta 5432 responde (exemplo com nc)
nc -zv localhost 5432 || echo "porta 5432 não acessível"

# Iniciar o backend
cd backend/hotel-backend
chmod +x mvnw    # apenas se necessário
./mvnw spring-boot:run
```

Notas
- Se o Test-NetConnection ou nc indicar que a conexão foi recusada, verifique se o serviço do PostgreSQL está em execução ou se o container Docker está ativo.
- Em cenários Docker-for-Windows, use `host.docker.internal` como host quando containers precisarem acessar serviços que rodam no host Windows.
- Não use senhas fracas em ambientes reais — use segredos/variáveis de ambiente seguras para produção.

---


## Backend (Spring Boot)

Localização: `backend/hotel-backend`

Requisitos adicionais (opcionais): banco de dados PostgreSQL — a aplicação lê as configurações em `src/main/resources/application.properties`. Você pode usar PostgreSQL, apontar para outro DB ou usar configurações de teste/in-memory conforme necessário.

### Rodando em desenvolvimento (PowerShell)

1. Abra um terminal PowerShell e vá para a pasta do backend:

```powershell
cd backend\hotel-backend
```

2. (Opcional) Configure variáveis de ambiente se quiser sobrescrever a configuração de banco de dados:

```powershell
#$env:SPRING_DATASOURCE_URL = 'jdbc:postgresql://localhost:5432/hotel_db'
#$env:SPRING_DATASOURCE_USERNAME = 'postgres'
#$env:SPRING_DATASOURCE_PASSWORD = 'senha'
```

3. Execute a aplicação com o Maven Wrapper:

```powershell
.\mvnw.cmd spring-boot:run
```

Ou, em sistemas Unix/macOS:

```bash
./mvnw spring-boot:run
```

Após iniciar, a API padrão escutará em `http://localhost:8080` salvo configuração contrária.

### Rodando em desenvolvimento (Linux / macOS)

1. Abra um terminal e vá para a pasta do backend:

```bash
cd backend/hotel-backend
```

2. Se for a primeira vez, torne o wrapper executável:

```bash
chmod +x mvnw
```

3. (Opcional) Exporte variáveis de ambiente na mesma sessão para sobrescrever a configuração do banco de dados:

```bash
export SPRING_DATASOURCE_URL='jdbc:postgresql://localhost:5432/hotel_db'
export SPRING_DATASOURCE_USERNAME='postgres'
export SPRING_DATASOURCE_PASSWORD='senha'
```

4. Execute a aplicação com o Maven Wrapper:

```bash
./mvnw spring-boot:run
```

Após iniciar, a API padrão escutará em `http://localhost:8080` salvo configuração contrária.

### Gerar JAR e executar

PowerShell:

```powershell
.\mvnw.cmd -DskipTests package
java -jar target\hotel-backend-0.0.1-SNAPSHOT.jar
```

Linux / macOS:

```bash
./mvnw -DskipTests package
java -jar target/hotel-backend-0.0.1-SNAPSHOT.jar
```

### Rodar testes (unitários / integração)

PowerShell:

```powershell
.\mvnw.cmd test
```

Linux / macOS:

```bash
./mvnw test
```

### Endpoints úteis

- Swagger UI (se ativado): `http://localhost:8080/swagger-ui/index.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

### Dicas e troubleshooting

- Porta em uso: se `8080` estiver ocupado, altere `server.port` em `application.properties` ou defina por JVM: `-Dserver.port=9090`.
- Variáveis de ambiente: lembre-se de exportar no mesmo shell onde roda o `mvnw` para que a JVM veja as variáveis.
- Dependências do banco: se você preferir testar sem PostgreSQL, rode os testes do projeto (muitos usam mocks) ou ajuste a configuração para H2 temporariamente.


## Frontend (Angular)

Localização: `frontend`

### Instalação de dependências

1. Abra um terminal na pasta `frontend` e instale as dependências:

PowerShell:
```powershell
cd frontend
npm install
```

Linux / macOS:
```bash
cd frontend
npm install

# se usar nvm (recomendado para gerenciar versões do Node)
# nvm install --lts
# nvm use --lts
```

Se preferir usar `yarn`, execute `yarn` (não há garantia de parity se scripts differirem).

### Servir a aplicação em modo de desenvolvimento

O frontend é configurado para acessar a API no backend (veja `proxy.conf.json` para o proxy usado no desenvolvimento).

PowerShell:

```powershell
# Usando npx (não requer global @angular/cli)
npx ng serve --proxy-config proxy.conf.json --open
```

Linux / macOS:

```bash
# usando npx (recomendado)
npx ng serve --proxy-config proxy.conf.json --open

# ou, se tiver ng global
# ng serve --proxy-config proxy.conf.json --open
```

Isso abrirá o frontend em `http://localhost:4200` e redirecionará chamadas para `/api` ao backend (normalmente em `http://localhost:8080`) usando `proxy.conf.json`.

Se preferir apenas executar a aplicação sem abrir automaticamente o browser, remova `--open`.

### Build para produção

PowerShell / cross-platform:

```bash
npx ng build --configuration production
```

Os arquivos de saída ficarão em `frontend/dist/`.

### Rodar testes (unitários)

PowerShell / Linux / macOS:

```bash
npm test
```

Observações:
- Se você usar CI, prefira rodar `npm test -- --watch=false` para garantir que os testes terminem.

---

## Rodando backend + frontend localmente

Fluxo típico de desenvolvimento:

1. No terminal A | rodar backend:

PowerShell:
```powershell
cd backend\hotel-backend
.\mvnw.cmd spring-boot:run
```

Linux / macOS:
```bash
cd backend/hotel-backend
chmod +x mvnw    # apenas se necessário
./mvnw spring-boot:run
```

2. No terminal B | rodar frontend (usa proxy para `/api`):

PowerShell:
```powershell
cd frontend
npx ng serve --proxy-config proxy.conf.json --open
```

Linux / macOS:
```bash
cd frontend
npx ng serve --proxy-config proxy.conf.json --open
```

Agora acesse `http://localhost:4200` (ou outra porta configurada) e a UI irá comunicar com o backend através do proxy.

---

## Boas práticas e melhorias de UX/Desenvolvimento

- Para reduzir flicker/em flashes ao atualizar tabelas, use `trackBy` nas diretivas `*ngFor` e overlays com transições de opacidade (o projeto já aplica melhorias deste tipo em componentes relevantes).
- Utilize `OnPush` change detection em componentes de lista pesada para reduzir re-renders.
- Ative `--max_old_space_size` no Node se builds grandes falharem por OOM: `node --max_old_space_size=4096 ./node_modules/.bin/ng build`.

---

## Executando os testes localmente — resumo rápido

- Backend (PowerShell / Linux):

PowerShell:
```powershell
cd backend\hotel-backend
.\mvnw.cmd test
```

Linux / macOS:
```bash
cd backend/hotel-backend
./mvnw test
```

- Frontend (PowerShell / Linux / macOS):

```bash
cd frontend
npm test
```

---

## Problemas comuns

- Erro: porta 8080 em uso — altere `server.port` ou finalize processo atual.
- Erro: CORS — use o `proxy.conf.json` durante desenvolvimento ou habilite CORS no backend.
- Tests falhando por falta de variáveis: verifique se exportou credenciais/URLs no shell usado para executar os testes.
- Docker no Linux pode requerer `sudo` ou adicionar seu usuário ao grupo `docker` (ver seção Docker acima).

---

## Contribuição

1. Faça um fork / branch por feature.
2. Rode os testes localmente (backend e frontend) antes de abrir PR.
3. Siga o estilo do projeto (TypeScript + linting, padrões Java do backend).
