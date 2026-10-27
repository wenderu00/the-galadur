# Galadur

[![CI](https://github.com/wenderu00/the-galadur/actions/workflows/ci.yml/badge.svg)](https://github.com/wenderu00/the-galadur/actions/workflows/ci.yml)
[![Licença: MIT](https://img.shields.io/badge/licen%C3%A7a-MIT-blue.svg)](LICENSE)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)

Jogo incremental de estratégia medieval no navegador: você começa com um castelo e poucos
recursos, constrói e evolui edifícios que produzem madeira, pedra, comida e ouro, treina
um exército e expande o império, inclusive enquanto está fora (até 8 horas de
progresso offline).

**[▶ Jogar](https://wenderu00.github.io/the-galadur/)**

![Visão da cidade: recursos, velocidade do jogo, construções e status do império](docs/screenshot.png)

## Arquitetura

A regra do jogo não depende do React. Ela vive numa **engine de funções puras** em
`src/features/game-engine/`, que recebe um `GameState` e devolve o próximo:

```mermaid
flowchart LR
  loop["useGameLoop<br/>(tick por segundo × velocidade)"] --> tick
  subgraph engine["game-engine (TypeScript puro, sem React)"]
    tick["tick.ts<br/>produção · fila de construção"]
    offline["offline.ts<br/>simula o tempo ausente (máx. 8h)"]
    combat["combat-engine.ts<br/>batalhas"]
    trade["trade.ts<br/>mercado"]
    migr["state-migration.ts<br/>saves antigos"]
  end
  tick --> atoms["átomos Jotai"] --> ui["UI (Next + design system mwds)"]
  atoms <--> storage[("localStorage")]
  ui -->|ações do jogador| engine
```

- **Balanceamento como dados:** cada edifício, unidade e inimigo é uma definição em
  `src/config/`, então ajustar custos e produção não mexe na engine.
- **Estado global com Jotai**, persistido no `localStorage` e migrado entre versões
  do formato do save.
- **Features por pasta** (`building`, `construction`, `resource`, `army`, `empire`…), cada
  uma com componentes, hooks e tipos próprios.

## Testes

| Tipo      | Ferramenta                  | O que cobre                                                                                                                         |
| --------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Unitários | Vitest                      | 55 testes: engine (produção, construção, combate, comércio, progresso offline, migração de estado) e formatação pt-BR               |
| E2E       | Playwright com Page Objects | 16 specs: HUD de recursos, grade de construções, fluxo de upgrade, exército, velocidade, tema, destaque de recursos e layout mobile |

O CI roda lint (com o modo estrito do mwds), typecheck, `format:check`, os testes unitários e o build a
cada push. Cada push no `main` também publica o jogo no GitHub Pages.

## Rodando localmente

```bash
npm ci
npm run dev          # http://localhost:3000
npm run test:unit    # engine
npm run test:e2e     # Playwright (sobe o dev server)
```

## Evolução

O Galadur é um projeto antigo que foi reescrito conforme eu aprendia: começou em Java
(2024), passou por React com JavaScript e por uma versão em JS puro com HTML (2025) até
chegar a esta, em TypeScript, com a engine separada da interface e testada.

## Stack

Next.js 16 · React 19 · TypeScript · Jotai · Tailwind CSS 4 · [mwds](https://github.com/wenderu00/mwds) · Vitest · Playwright · GitHub Pages

A documentação completa de tipos, engine e componentes está em [`PROJETO.md`](PROJETO.md).
A identidade visual é a do design system [mwds](https://wenderu00.github.io/mwds/), aplicada à risca.

## Licença

[MIT](LICENSE)
