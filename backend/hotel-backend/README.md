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

Regras de negócio implementadas
- Preços e cobrança:
  - O valor da estadia é calculado por noite, com distinção entre dias úteis (weekdays) e finais de semana (weekends).
  - Taxa de estacionamento é cobrada por noite quando o hóspede tem `hasCar = true`.

- Check-out / tarifas late-checkout:
  - Existe um endpoint de preview: `GET /api/stay/{id}/checkout-preview` que retorna um detalhamento (valor por dias úteis, fins de semana, estacionamento, taxas extras e total).
  - Regras aplicadas no checkout (`PATCH /api/stay/{id}/checkout`):
    - Saída até 12:00 → sem cobrança extra.
    - Saída entre 12:00 (exclusive) e 14:00 (exclusive) → aplica-se uma multa de 50% do valor da diária (respeitando a divisão weekday/weekend na composição do valor).
    - Saída a partir de 14:00 → cobra-se mais uma diária completa.
    - Exceção C2 (mesmo dia): se o check-in e o check-out ocorrerem no mesmo dia, não é aplicada multa nem diária extra — cobra-se apenas 1 diária.

- Check-in:
  - O backend expõe `PATCH /api/stay/{id}/checkin` para registrar o check-in com timestamp.

- Busca e filtros:
  - `GET /api/stay/search` aceita opcionalmente o parâmetro `status` (valores: `RESERVED`, `CHECKED_IN`, `CHECKED_OUT`) para filtrar resultados.

- Contratos e formatos:
  - Os endpoints que recebem horários (checkin/checkout) esperam datetimes no formato ISO local (por exemplo `2025-11-01T14:30:00`) — o frontend usa `datetime-local` e envia o valor com segundos adicionados.

- Tratamento de erros:
  - Erros comuns retornados pelo backend incluem 404 (recurso não encontrado) e 409 (conflito de estado / operação inválida), além de mensagens descritivas no corpo JSON.

Migrações / schema
- O projeto durante desenvolvimento usa `spring.jpa.hibernate.ddl-auto=update` (arquivo `application.properties`) — isso é conveniente para desenvolvimento, mas não recomendado para produção. Se desejar controle de schema, adicione Flyway/Liquibase e um script de migração para adicionar as colunas `planned_start_date`, `planned_end_date` e `number_of_guests` caso o avaliador rode contra um banco existente.

Dicas úteis
- Limpe o cache do navegador ao testar favicons/recursos estáticos.
- Para rodar frontend (Angular), vá para a pasta `frontend` e use `npm start` ou `ng serve`.
