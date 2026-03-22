# Mission 01 — Configuração do Playwright

> **Estimativa de tokens:** ~2.000

## Objetivo

Instalar o Playwright no projeto e criar a estrutura de pastas para Page Objects e specs.

## Contexto

O projeto roda em `http://localhost:5173` via `npm run dev`. A raiz do projeto é `/home/marcio/projects/the-galadur`.

## Tarefas

1. Confirmar com o usuário antes de instalar dependências, depois instalar `@playwright/test` como devDependency e o browser Chromium via `npx playwright install chromium`.

2. Criar `playwright.config.ts` na raiz do projeto configurando:
   - `testDir` apontando para `./tests/specs`
   - `baseURL` como `http://localhost:5173`
   - Apenas o projeto `chromium`
   - `webServer` com `npm run dev`, reaproveitando servidor existente
   - `fullyParallel: false` e `retries: 0`

3. Criar as pastas `tests/pages/` e `tests/specs/`.

4. Adicionar ao `package.json` os scripts `test:e2e`, `test:e2e:ui` e `test:e2e:headed`.

5. Adicionar `test-results/` e `playwright-report/` ao `.gitignore`.

6. Verificar a instalação executando `npx playwright test --list` — deve retornar zero testes sem erros de configuração.

## Critério de conclusão

`playwright.config.ts` existe na raiz, as pastas `tests/pages/` e `tests/specs/` existem, e `npm run test:e2e` executa sem erros de configuração.
