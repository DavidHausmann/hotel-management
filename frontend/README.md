# Frontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.18.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

Note: this project uses a custom Karma configuration (`karma.conf.js`) with a CI-friendly headless Chrome launcher and increased timeouts to reduce intermittent browser disconnects. To run the tests headlessly (recommended for CI or fast local runs) use:

```powershell
npm run test -- --watch=false --browsers=ChromeHeadlessCustom
```

The custom launcher flags and timeouts are configured in `frontend/karma.conf.js` — adjust them if your CI environment needs different Chrome flags.

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Regras de negócio implementadas no frontend

Esta seção resume as regras de negócio e comportamentos implementados no cliente (frontend) para espelhar a lógica do backend e fornecer UX consistente.

- Dashboard (Home):
	- O frontend consulta `GET /api/home` via `HomeService.getDashboard()` e mantém o resultado em `HomePageService` (BehaviorSubject) para compartilhamento entre componentes.
	- `HomePageComponent` mostra métricas resumidas (reservas totais, check-ins ativos, hóspedes atuais, carros atuais) e exibe textos de carregamento/unknown quando os dados ainda não estão disponíveis.

- Pesquisa de estadias / filtro por status:
	- A página de reservas inclui um filtro de `Status` (mat-select) com opções: Todos, RESERVED, CHECKED_IN, CHECKED_OUT.
	- O valor selecionado é passado para o componente de tabela e enviado como `status` ao backend via `HotelReservationsService.searchReservations()` como parâmetro de query.

- Checkout preview e checkout real:
	- O modal de preview de checkout consome o endpoint `GET /api/stay/{id}/checkout-preview` e exibe um detalhamento: valor por dias úteis, finais de semana, estacionamento, taxas extras e total.
	- Ao confirmar, o modal chama `PATCH /api/stay/{id}/checkout` (implementado no serviço) e fecha retornando sucesso para o chamador, que atualiza a lista de reservas.

- Formatos de data/hora:
	- Entradas de data/hora de checkin/checkout usam `datetime-local` no template e o frontend envia datetimes no formato ISO local (`YYYY-MM-DDTHH:mm:ss`), compatível com o backend.

- Comportamento de filtros (UX):
	- O botão "Limpar filtros" reseta todos os campos de filtro (nome, documento, telefone, datas e status) tanto no formulário quanto nos valores aplicados à tabela.

- Loading / transições suaves:
	- Para evitar flashes visuais ao paginar ou recarregar tabelas, o frontend usa overlays persistentes com transição de opacidade e reserva mínima de altura nas tabelas (reduz saltos de layout).

- Tradução/labels e helpers:
	- Helpers no `HomePageComponent` formatam textos (singular/plural e placeholders de carregamento) para apresentar métricas de forma legível.

- Tratamento de erros e feedback ao usuário:
	- Operações que podem falhar (preview/checkout) exibem mensagens via Snackbar e não bloqueiam a interface; erros do backend são exibidos quando disponíveis.

Se quiser, posso adicionar exemplos de payloads/respostas JSON para os fluxos de checkout e search no README do frontend ou adicionar testes de integração que cubram o fluxo UI → API para status e checkout.
