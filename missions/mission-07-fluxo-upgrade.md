# Mission 07 — Fluxo de Upgrade de Edifício

> **Estimativa de tokens:** ~5.500

## Pré-requisito

Missions 02 a 06 concluídas (todos os Page Objects disponíveis).

## Objetivo

Criar o teste de fluxo completo de upgrade de edifício, integrando os Page Objects criados nas missions anteriores.

## Contexto

O fluxo de upgrade exige recursos suficientes. O Castelo nível 1 → nível 2 tem os seguintes custos (verificar os valores exatos no código em `src/config/buildings/castle.ts` antes de escrever o teste):

O fluxo completo ocorre assim:
1. O jogador abre o modal do edifício
2. Verifica os custos do próximo nível
3. Com recursos suficientes, clica em "Construir Nível X"
4. O modal fecha automaticamente
5. O edifício aparece na fila de construção no painel direito
6. A fila exibe o nome do edifício e a barra de progresso
7. Após o tempo de construção, o edifício sobe de nível
8. A pontuação do Império é atualizada

Para testar o upgrade sem esperar o tempo real de construção, acelerar o jogo para `4x` ou manipular o `localStorage` para injetar recursos suficientes e simular a conclusão da construção via `page.evaluate`.

O estado inicial não tem recursos suficientes para todos os upgrades — use `page.evaluate` para setar o `localStorage` com o estado desejado (recursos abundantes) antes do teste de upgrade.

## Tarefas

1. Ler o arquivo `src/config/buildings/castle.ts` para obter os custos exatos do nível 2 do Castelo.

2. Usar o MCP Playwright para inspecionar o comportamento após clicar em upgrade: verificar que o modal fecha, que o card do edifício exibe a barra de progresso e que o item aparece na fila do painel.

3. Criar `tests/specs/upgrade-flow.spec.ts` importando os Page Objects necessários (`BuildingGridPage`, `BuildingModalPage`, `SummaryPanelPage`) com testes que verifiquem:
   - Com recursos insuficientes, o botão de upgrade está desabilitado no modal do Castelo
   - Com recursos suficientes (injetados via `localStorage`), o botão de upgrade está habilitado
   - Após clicar em upgrade, o modal fecha
   - Após clicar em upgrade, o Castelo aparece na fila de construção
   - Após clicar em upgrade, o Total de Construções permanece 1 (o edifício existe, mas ainda não subiu de nível)
   - Após a construção ser concluída (simular via `page.evaluate` avançando o `completesAt` para o passado e recarregando), o Castelo está no nível 2
   - Após o upgrade completo, a Pontuação do Império é 60

4. Executar os testes com `--headed` e ajustar até todos passarem.

5. Executar a suite completa `npm run test:e2e` para garantir que nenhuma mission anterior foi quebrada.

## Critério de conclusão

`tests/specs/upgrade-flow.spec.ts` existe, todos os 7 testes passam, e a suite completa `npm run test:e2e` termina sem falhas.
