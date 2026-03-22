# Mission 03 — Page Object: GameSpeedControls

> **Estimativa de tokens:** ~3.500

## Pré-requisito

Mission 01 concluída.

## Objetivo

Criar o Page Object para os controles de velocidade e os testes correspondentes.

## Contexto

O `GameSpeedControls` fica no canto direito do `<header>`. É composto por um botão de pausa e quatro botões de velocidade: `0.5x`, `1x`, `2x` e `4x`. A velocidade inicial é `1x`. O botão ativo recebe a classe `bg-blue-600`. Clicar em pausa alterna entre pausado e velocidade `1x`. O estado de velocidade é mantido em memória — não persiste no `localStorage` — portanto recarregar a página sempre retorna a velocidade `1x`.

## Tarefas

1. Usar o MCP Playwright para navegar até `http://localhost:5173` e capturar um snapshot focado no canto direito do `<header>` para identificar os seletores reais dos botões.

2. Criar `tests/pages/GameSpeedControlsPage.ts` com métodos para:
   - Clicar no botão de pausa
   - Clicar em um botão de velocidade específico
   - Verificar se uma velocidade está ativa (botão com classe `bg-blue-600`)
   - Verificar se o jogo está pausado

3. Criar `tests/specs/game-speed.spec.ts` com testes que verifiquem:
   - A velocidade inicial é `1x`
   - Clicar em pausa ativa o estado pausado
   - Clicar em pausa duas vezes retoma a velocidade `1x`
   - Clicar em `2x` ativa `2x` e desativa `1x`
   - Clicar em `4x` ativa `4x`
   - Clicar em `0.5x` ativa `0.5x`
   - Apenas uma velocidade fica ativa por vez

4. Executar os testes com `--headed` e ajustar seletores até todos passarem.

## Critério de conclusão

`tests/pages/GameSpeedControlsPage.ts` e `tests/specs/game-speed.spec.ts` existem, 7 testes passam, e nenhum teste de missions anteriores é quebrado.
