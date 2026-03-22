# Mission 05 — Page Object: BuildingModal

> **Estimativa de tokens:** ~5.000

## Pré-requisito

Mission 04 concluída (`BuildingGridPage` disponível para abrir o modal).

## Objetivo

Criar o Page Object para o modal de edifício e os testes correspondentes.

## Contexto

O `BuildingModal` é um `Dialog` (shadcn/ui) aberto ao clicar em qualquer `BuildingCard`. Contém: cabeçalho com nome e nível do edifício, descrição, estatísticas de produção atual, custos do próximo nível (madeira, pedra, comida, ouro e tempo de construção), e rodapé com os botões de ação. Os botões de ação variam conforme o estado:

- Edifício no máximo (nível 3): apenas botão "Fechar"
- Edifício em construção: botão de upgrade desabilitado com texto indicando construção em andamento
- Recursos insuficientes: botão de upgrade desabilitado
- Recursos suficientes: botão de upgrade habilitado com o texto "Construir Nível X"

No estado inicial, todos os edifícios exceto o Castelo estão no nível 0. O Castelo está no nível 1 e pode ser melhorado para o nível 2. O `localStorage` deve ser limpo antes de cada teste para garantir estado inicial.

## Tarefas

1. Usar o MCP Playwright para navegar até `http://localhost:5173`, clicar no card do Castelo e capturar um snapshot do modal aberto para identificar os seletores reais de cada seção.

2. Usar o MCP Playwright para capturar o snapshot do modal de um edifício no nível 0 (ex: Fazenda) para comparar a estrutura.

3. Criar `tests/pages/BuildingModalPage.ts` com métodos para:
   - Verificar se o modal está visível
   - Ler o nome do edifício exibido no modal
   - Ler o nível atual exibido no modal
   - Verificar se o botão de upgrade está habilitado
   - Verificar se o botão de upgrade está desabilitado
   - Clicar no botão de upgrade
   - Fechar o modal

4. Criar `tests/specs/building-modal.spec.ts` com testes que verifiquem:
   - Abrir o modal do Castelo exibe o nome "Castelo" e nível 1
   - Abrir o modal da Fazenda exibe o nome "Fazenda" e nível 0
   - O modal do Castelo exibe os custos do nível 2
   - Com recursos insuficientes, o botão de upgrade está desabilitado
   - Fechar o modal via botão "Fechar" faz o modal desaparecer
   - Fechar o modal via clique fora do dialog faz o modal desaparecer

5. Executar os testes com `--headed` e ajustar seletores até todos passarem.

## Critério de conclusão

`tests/pages/BuildingModalPage.ts` e `tests/specs/building-modal.spec.ts` existem, todos os testes passam, e `npm run test:e2e` não apresenta falhas.
