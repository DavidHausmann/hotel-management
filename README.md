# hotel-management
Application for management of hotel reservations.
## Backend (hotel-backend) - Quick start

This project includes a Maven-based Spring Boot backend located at `backend/hotel-backend`.

Requirements
- Java 17 (JDK)
- Git (optional)
- PostgreSQL running at the URL configured in `src/main/resources/application.properties`, or override via environment variables / JVM properties

The repository includes a Maven wrapper so you don't need a system Maven install.

Run locally (PowerShell)

1. Open a PowerShell terminal and change to the backend module:

```powershell
cd backend\hotel-backend
```

2. (Optional) Adjust database connection in `src/main/resources/application.properties` or export environment variables. Example (PowerShell):

```powershell
#$env:SPRING_DATASOURCE_URL = 'jdbc:postgresql://localhost:5432/hotel_db'
#$env:SPRING_DATASOURCE_USERNAME = 'postgres'
#$env:SPRING_DATASOURCE_PASSWORD = 'admin'
# Then run the application in the same shell so the vars are visible to the JVM
```

3. Run the application with the Maven wrapper (development):

```powershell
.\mvnw spring-boot:run
```

If you prefer to build a JAR and run it:

```powershell
.\mvnw -DskipTests package
java -jar target\hotel-backend-0.0.1-SNAPSHOT.jar
```

Run tests

```powershell
.\mvnw test
```

Useful endpoints
- Swagger UI: http://localhost:8080/swagger-ui/index.html
- OpenAPI JSON: http://localhost:8080/v3/api-docs

Configuration notes
- Default DB settings are in `src/main/resources/application.properties` (PostgreSQL). You can override them with environment variables or JVM properties (for example `-Dspring.datasource.url=...`).
- If you don't have PostgreSQL available for quick experimentation, you can temporarily switch to an in-memory DB (H2) by updating the `spring.datasource.url` and adding the H2 dependency — or run tests which use mocks/in-memory setups already present.

Troubleshooting
- "Port 8080 already in use": stop the process using that port or change `server.port` in `application.properties`.
- If Lombok annotations don't resolve in your IDE, install the Lombok plugin and enable annotation processing.

Notes for reviewers / test runners
- The project contains unit tests and controller tests under `src/test/java` — run them with `mvnw test`.
- The OpenAPI (springdoc) UI is enabled and shows request/response schemas and examples at the Swagger UI URL above.

If you want, I can add a simple PowerShell script to automate building and running the backend with sensible defaults.
