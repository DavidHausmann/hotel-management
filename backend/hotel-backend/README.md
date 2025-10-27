# Hotel-backend — instruções rápidas

Este diretório contém a API Spring Boot usada no projeto Hotel Management.

Resumo rápido
- Java 17
- Spring Boot 3.5.x
- Build com Maven (use o wrapper `mvnw` incluído)

Pré-requisitos
- Java 17 instalado
- (Opcional) Maven instalado globalmente — não necessário se usar o wrapper

Rodando a aplicação localmente (desenvolvimento)

1. Ajuste `src/main/resources/application.properties` para apontar para seu banco PostgreSQL local (se for usar Postgres). O projeto atualmente usa:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/hotel_db
spring.datasource.username=postgres
spring.datasource.password=admin
```

2. Para iniciar a aplicação (PowerShell):

```powershell
cd caminho-do-projeto\hotel-management\backend\hotel-backend
.\mvnw spring-boot:run
```

Se não tiver o `mvnw` executável no seu ambiente, use `mvn -f backend/hotel-backend spring-boot:run` (supondo que `mvn` esteja no PATH).

Executando os testes

- Executar toda a suíte de testes (unit + integration):

```powershell
cd caminho-do-projeto\hotel-management\backend\hotel-backend
.\mvnw test
```

- Executar apenas o teste de integração do dashboard (usa H2 in-memory via profile `test`):

```powershell
.\mvnw -Dtest=HomeControllerIntegrationTest test
```

Nota sobre testes de integração
- Os testes de integração usam um banco H2 em memória configurado no profile `test` (arquivo `src/test/resources/application-test.properties`). Isso evita tocar no seu banco de desenvolvimento.

Endpoint de dashboard (home)
- GET /api/home — retorna um JSON com as métricas:

```json
{
  "totalReservations": number,
  "totalActiveCheckins": number,
  "totalCurrentGuests": number,
  "totalCurrentCars": number
}
```

Como as métricas são calculadas (resumo)
- totalReservations: conta reservas planejadas que sobrepõem o mês corrente (plannedStartDate/plannedEndDate).
- totalActiveCheckins: número de stays com status `CHECKED_IN`.
- totalCurrentGuests: soma do campo `numberOfGuests` para stays `CHECKED_IN`.
- totalCurrentCars: conta stays `CHECKED_IN` cujo hóspede associado tem `hasCar = true`.

Migrações / schema
- O projeto durante desenvolvimento usa `spring.jpa.hibernate.ddl-auto=update` (arquivo `application.properties`) — isso é conveniente para desenvolvimento, mas não recomendado para produção. Se desejar controle de schema, adicione Flyway/Liquibase e um script de migração para adicionar as colunas `planned_start_date`, `planned_end_date` e `number_of_guests` caso o avaliador rode contra um banco existente.

Dicas úteis
- Limpe o cache do navegador ao testar favicons/recursos estáticos.
- Para rodar frontend (Angular), vá para a pasta `frontend` e use `npm start` ou `ng serve`.
