# Mission 04 — Page Object: BuildingGrid

> **Estimativa de tokens:** ~4.500

## Pré-requisito

Mission 01 e Mission 02 concluídas (o método `clearGameState` do `ResourceHUDPage` serve de referência para limpeza de estado).

## Objetivo

Criar o Page Object para a grade de edifícios e os testes correspondentes.

## Contexto

O `BuildingGrid` ocupa a área principal (`<main>`) do jogo. Exibe 7 edifícios em cards: Castelo, Fazenda, Serraria, Mina, Mercado, Quartéis e Prefeitura. Cada `BuildingCard` é um `<article>` clicável que mostra o nome do edifício, o nível atual no formato `Nível X / Y`, uma descrição curta, estatísticas de produção e um botão de upgrade. No estado inicial, apenas o Castelo está no nível 1 — todos os demais estão no nível 0. Clicar em qualquer card abre o `BuildingModal`. O estado do jogo persiste no `localStorage`, portanto os testes devem limpar o `localStorage` e recarregar antes de cada execução.

## Tarefas

1. Usar o MCP Playwright para navegar até `http://localhost:5173` e capturar um snapshot do `<main>` para identificar os seletores reais dos cards e seus elementos internos.

2. Criar `tests/pages/BuildingGridPage.ts` com métodos para:
   - Limpar o `localStorage` e recarregar a página
   - Contar quantos cards de edifício estão visíveis
   - Obter o card de um edifício pelo nome
   - Ler o texto de nível de um card pelo nome do edifício
   - Clicar em um card pelo nome do edifício

3. Criar `tests/specs/building-grid.spec.ts` com testes que verifiquem:
   - Exatamente 7 cards são exibidos no carregamento
   - O Castelo aparece com "Nível 1"
   - Os demais 6 edifícios aparecem com "Nível 0"
   - Cada card exibe o nome do edifício visível
   - Clicar em um card abre algum elemento modal (verificar presença do modal, sem entrar nos detalhes — isso é escopo da Mission 05)

4. Executar os testes com `--headed` e ajustar seletores até todos passarem.

## Critério de conclusão

`tests/pages/BuildingGridPage.ts` e `tests/specs/building-grid.spec.ts` existem, todos os testes passam, e `npm run test:e2e` não apresenta falhas.
