# Mission 02 — Page Object: ResourceHUD

> **Estimativa de tokens:** ~4.000

## Pré-requisito

Mission 01 concluída.

## Objetivo

Criar o Page Object para o HUD de recursos e os testes correspondentes.

## Contexto

O `ResourceHUD` é o `<header>` fixo do jogo. Exibe quatro recursos — madeira, pedra, comida e ouro — cada um com valor atual, valor máximo e taxa de produção por segundo. O estado inicial é: madeira 50, pedra 30, comida 20, ouro 0, com produções de +0.5/s, +0.3/s, +0.3/s e 0/s respectivamente. À direita ficam o contador de dias e os controles de velocidade. O estado do jogo persiste no `localStorage`, portanto os testes devem limpar o `localStorage` e recarregar a página antes de cada execução para garantir estado inicial.

## Tarefas

1. Usar o MCP Playwright para navegar até `http://localhost:5173` e capturar um snapshot do `<header>` a fim de identificar os seletores reais dos elementos antes de escrever qualquer código.

2. Criar `tests/pages/ResourceHUDPage.ts` com métodos para:
   - Limpar o `localStorage` e recarregar a página
   - Obter o valor atual de cada recurso pelo tipo (`wood`, `stone`, `food`, `gold`)
   - Obter a taxa de produção de cada recurso
   - Obter o texto do contador de dias

3. Criar `tests/specs/resource-hud.spec.ts` com testes que verifiquem:
   - Os quatro recursos estão visíveis no carregamento
   - Madeira começa com 50 unidades
   - Pedra começa com 30 unidades
   - Comida começa com 20 unidades
   - Ouro começa com 0 unidades
   - A taxa de produção de madeira exibe +0.5/s
   - O contador de dias começa no dia 1

4. Executar os testes com `--headed` e ajustar seletores até todos passarem.

## Critério de conclusão

`tests/pages/ResourceHUDPage.ts` e `tests/specs/resource-hud.spec.ts` existem, 7 testes passam, e `npm run test:e2e` não apresenta falhas.
