# Mission 06 — Page Object: SummaryPanel

> **Estimativa de tokens:** ~4.000

## Pré-requisito

Mission 01 concluída.

## Objetivo

Criar o Page Object para o painel lateral direito e os testes correspondentes.

## Contexto

O `GameSummaryPanel` é o `<aside>` direito do layout. Contém três seções:

**Fila de Construção (`ConstructionQueue`):** exibe os itens em construção com nome do edifício, nível alvo e barra de progresso. Quando vazia, exibe o texto "Nenhuma construção em andamento".

**Status do Império (`EmpireStats`):** exibe três métricas calculadas a partir dos edifícios com nível > 0:
- Total de Construções
- Níveis Totais
- Pontuação do Império (níveis totais × 30)

No estado inicial (apenas Castelo nível 1): Total de Construções = 1, Níveis Totais = 1, Pontuação = 30.

**Eventos Recentes (`RecentEvents`):** lista os últimos eventos do jogo. Inicialmente vazia.

O estado do jogo persiste no `localStorage`, portanto os testes devem limpar o `localStorage` e recarregar antes de cada execução.

## Tarefas

1. Usar o MCP Playwright para navegar até `http://localhost:5173` e capturar um snapshot do `<aside>` direito para identificar os seletores reais de cada seção.

2. Criar `tests/pages/SummaryPanelPage.ts` com métodos para:
   - Verificar se a fila de construção está vazia (texto de fila vazia visível)
   - Contar itens na fila de construção
   - Obter o nome do edifício em construção pelo índice da fila
   - Ler o valor de "Total de Construções"
   - Ler o valor de "Níveis Totais"
   - Ler o valor de "Pontuação do Império"

3. Criar `tests/specs/summary-panel.spec.ts` com testes que verifiquem:
   - A fila de construção exibe a mensagem de fila vazia no estado inicial
   - Total de Construções é 1 no estado inicial
   - Níveis Totais é 1 no estado inicial
   - Pontuação do Império é 30 no estado inicial

4. Executar os testes com `--headed` e ajustar seletores até todos passarem.

## Critério de conclusão

`tests/pages/SummaryPanelPage.ts` e `tests/specs/summary-panel.spec.ts` existem, 4 testes passam, e `npm run test:e2e` não apresenta falhas.
