# Galadur — Documentação Completa do Projeto

> Gerado em 2026-03-21 e atualizado em 2026-10-26 na migração para Next e mwds. Descreve o estado atual do projeto com detalhes sobre arquitetura, mecânicas, tipos, lógica de engine, componentes, átomos de estado e convenções de código.

---

## 1. Visão Geral

**Galadur** é um jogo incremental/idle com temática medieval, desenvolvido como aplicação web com Next.js e React. O jogador gerencia um império que começa com um castelo nível 1 e recursos iniciais modestos (50 madeira, 30 pedra, 20 comida, 0 ouro). A progressão é feita construindo e evoluindo edifícios que produzem recursos passivamente ao longo do tempo, financiando construções cada vez mais caras.

O jogo roda inteiramente no navegador, sem backend. Todo estado é persistido no `localStorage` e sobrevive ao fechamento do navegador. Há suporte a progressão offline: ao reabrir o jogo, o tempo que passou é simulado retroativamente (limitado a 8 horas).

---

## 2. Stack de Tecnologias

| Ferramenta           | Versão | Função                                                 |
| -------------------- | ------ | ------------------------------------------------------ |
| Next.js (App Router) | 16     | Framework e build estático (`output: 'export'`)        |
| React                | 19     | Biblioteca de UI                                       |
| TypeScript           | 5      | Tipagem estática                                       |
| Tailwind CSS         | 4      | Estilização via classes utilitárias e tokens           |
| mwds (`@marcio`)     | 0.16   | Design system: tokens, componentes e lint estrito      |
| radix-ui             | 1      | Primitivos acessíveis usados pelos componentes do mwds |
| Jotai                | 2      | Gerenciamento de estado global                         |
| lucide-react         | 1      | Todos os ícones do jogo                                |
| Vitest               | 4      | Testes unitários da engine e dos formatadores          |
| Playwright           | 1      | Testes E2E com Page Objects                            |

---

## 3. Estrutura de Pastas

```
galadur/
├── next.config.ts                     ← Export estático; basePath /the-galadur só em produção
├── components.json                    ← Registry @marcio do shadcn
├── eslint.config.mjs                  ← Next + regras do projeto + modo estrito do mwds
├── eslint.mw.mjs, eslint-rules/       ← Regras mw/* instaladas pelo marcio-strict
├── CLAUDE.md                          ← Regras técnicas do projeto
├── PROJETO.md                         ← Este arquivo
│
└── src/
    ├── app/
    │   ├── layout.tsx                 ← Fontes, ThemeScript, TooltipProvider e Toaster
    │   ├── page.tsx                   ← Única página: renderiza GameClient
    │   ├── providers.tsx              ← Jotai Provider + inicializador do game loop
    │   ├── globals.css                ← Tokens do mwds (gerado pelo registry)
    │   └── mw-strict.css              ← Reset da paleta padrão do Tailwind (modo estrito)
    │
    ├── components/
    │   ├── ui/                        ← Componentes do mwds (gerados, não editar à mão)
    │
    ├── config/                        ← Definições de edifícios, unidades e inimigos
    ├── lib/
    │   ├── format.ts                  ← Números, taxas e durações em pt-BR
    │   └── utils.ts                   ← cn() (gerado pelo mwds)
    ├── store/                         ← Átomos Jotai (estado, navegação, eventos de recurso)
    │
    └── features/
        ├── game-engine/               ← Engine pura e hooks do loop
        └── game/
            ├── GameClient.tsx         ← Carrega o jogo só no cliente (ssr: false)
            ├── GamePage.tsx           ← Providers + GameLayout
            ├── components/            ← Compartilhados do jogo: GameLayout, PanelSection,
            │                            TimedProgress, BuildingIcon, UnitIcon, GameSummaryPanel
            ├── hooks/useNow.ts        ← Relógio para barras de progresso
            ├── navigation/            ← GameBrand e useGameNavigation (itens do AppShell)
            ├── resource/              ← HUD: ResourceMeters, GameDayCounter, GameSpeedControls
            ├── construction/          ← Fila de construção
            ├── empire/                ← Status, eventos recentes e dica
            ├── building/
            │   ├── BuildingGrid.tsx   ← Ponto de entrada: grade + modal
            │   ├── BuildingExtra.tsx  ← Conteúdo extra do modal por edifício
            │   ├── card/              ← BuildingCard, BuildingStats, useBuildingCard
            │   ├── modal/             ← BuildingModal e seções de custo, produção e ações
            │   ├── castle/            ← Slider de ouro do castelo
            │   ├── prefeitura/        ← Bônus de construção
            │   ├── barracks/          ← Treino de unidades
            │   └── market/            ← Comércio
            └── army/
                ├── ArmyPage.tsx       ← Ponto de entrada
                ├── roster/            ← Tropas disponíveis
                ├── enemies/           ← Lista e card de inimigos
                ├── mobilization/      ← Modal de mobilização
                └── battle/            ← Resultado, saque e perdas
```

---

## 4. Tipos do Domínio (`types.ts`)

O arquivo `src/features/game-engine/types.ts` é a fonte de verdade de todos os tipos. Nenhum outro arquivo define tipos de domínio fora dele (exceto tipos puramente de UI como props de componentes).

### Recursos

```ts
type ResourceKind = 'wood' | 'stone' | 'food' | 'gold';

interface ResourceAmount {
  wood: number;
  stone: number;
  food: number;
  gold: number;
}

interface ResourceStore {
  current: ResourceAmount; // quanto o jogador tem agora
  max: ResourceAmount; // capacidade máxima de armazenamento
}
```

### Edifícios

```ts
type BuildingId = 'castle' | 'farm' | 'sawmill' | 'mine' | 'market' | 'barracks' | 'prefeitura';

type BuildingLevel = 0 | 1 | 2 | 3;
// 0 = não construído, 1-3 = níveis

interface BuildingState {
  id: BuildingId;
  level: BuildingLevel;
}
```

### Efeitos e Definições

```ts
interface BuildingLevelEffects {
  productionPerTick: Partial<ResourceAmount>; // produção por segundo
  storageBonus: Partial<ResourceAmount>; // bônus de armazenamento adicionado
  constructionSpeedBonus?: number; // fração de redução no tempo de construção (0.15 = 15% mais rápido)
}

interface BuildingLevelDefinition {
  level: Exclude<BuildingLevel, 0>; // 1 | 2 | 3
  cost: ResourceAmount; // custo para construir/upar
  buildTimeSeconds: number; // tempo base de construção em segundos
  effects: BuildingLevelEffects;
}

interface BuildingDefinition {
  id: BuildingId;
  name: string;
  description: string;
  category: 'headquarters' | 'producer' | 'military';
  maxLevel: 3;
  levels: [BuildingLevelDefinition, BuildingLevelDefinition, BuildingLevelDefinition];
}
```

### Fila de Construção e Estado do Jogo

```ts
interface BuildQueueEntry {
  buildingId: BuildingId;
  targetLevel: Exclude<BuildingLevel, 0>;
  startedAt: number; // timestamp em ms (Date.now())
  completesAt: number; // timestamp em ms quando termina
}

interface GameState {
  resources: ResourceStore;
  buildings: Record<BuildingId, BuildingState>;
  buildQueue: BuildQueueEntry[];
  lastSavedAt: number; // timestamp da última atualização
  version: number; // versão do schema (atual: 1)
  castleGoldRate: number; // produção de ouro configurada no castelo (0 a maxRate)
}

type ConstructionResult =
  | { success: true; state: GameState }
  | { success: false; error: 'queue_full' | 'max_level' | 'cannot_afford' | 'already_max_level' };
```

---

## 5. Configuração dos Edifícios

### Castelo (`castle.ts`)

- **Categoria**: headquarters
- **Função**: Sede do império. Controla limites de armazenamento e possui produção ajustável de ouro.
- **Começa**: Nível 1 automaticamente no início do jogo.

| Nível | Madeira | Pedra | Comida | Ouro | Tempo | Prod./tick (mad/ped/com/ouro)            | Storage                 |
| ----- | ------- | ----- | ------ | ---- | ----- | ---------------------------------------- | ----------------------- |
| 1     | 0       | 0     | 0      | 0    | 0s    | +0.5 / +0.3 / +0.3 / ajustável           | +200/+200/+200/+100     |
| 2     | 40      | 50    | 15     | 0    | 45s   | +1.0 / +0.6 / +0.6 / ajustável (max 0.1) | +500/+500/+500/+300     |
| 3     | 120     | 180   | 60     | 15   | 240s  | +2.0 / +1.2 / +1.2 / ajustável (max 0.3) | +1500/+1500/+1500/+1000 |

**Mecânica especial**: O ouro produzido pelo castelo não é fixo. O jogador ajusta um slider no modal do castelo que vai de 0 até o valor máximo do nível atual. Isso permite controle sobre o quanto de capacidade de produção de ouro é alocada. O valor é persistido em `gameState.castleGoldRate`.

---

### Fazenda (`farm.ts`)

- **Categoria**: producer
- **Função**: Produz comida.

| Nível | Madeira | Pedra | Comida | Ouro | Tempo | Comida/tick |
| ----- | ------- | ----- | ------ | ---- | ----- | ----------- |
| 1     | 30      | 10    | 0      | 0    | 60s   | +0.5        |
| 2     | 80      | 30    | 0      | 0    | 180s  | +1.5        |
| 3     | 200     | 100   | 0      | 20   | 480s  | +4.0        |

---

### Serraria (`sawmill.ts`)

- **Categoria**: producer
- **Função**: Produz madeira.

| Nível | Madeira | Pedra | Comida | Ouro | Tempo | Madeira/tick |
| ----- | ------- | ----- | ------ | ---- | ----- | ------------ |
| 1     | 0       | 15    | 5      | 0    | 60s   | +0.5         |
| 2     | 60      | 50    | 15     | 0    | 200s  | +1.5         |
| 3     | 150     | 150   | 50     | 30   | 500s  | +4.0         |

---

### Mina (`mine.ts`)

- **Categoria**: producer
- **Função**: Produz pedra.

| Nível | Madeira | Pedra | Comida | Ouro | Tempo | Pedra/tick |
| ----- | ------- | ----- | ------ | ---- | ----- | ---------- |
| 1     | 40      | 0     | 10     | 0    | 90s   | +0.4       |
| 2     | 100     | 20    | 30     | 0    | 240s  | +1.2       |
| 3     | 250     | 60    | 80     | 50   | 600s  | +3.5       |

---

### Mercado (`market.ts`)

- **Categoria**: producer
- **Função**: Produz ouro de forma fixa (diferente do castelo que é ajustável).

| Nível | Madeira | Pedra | Comida | Ouro | Tempo | Ouro/tick |
| ----- | ------- | ----- | ------ | ---- | ----- | --------- |
| 1     | 60      | 40    | 20     | 0    | 120s  | +0.2      |
| 2     | 150     | 120   | 60     | 10   | 360s  | +0.6      |
| 3     | 400     | 300   | 150    | 50   | 720s  | +1.5      |

---

### Quartéis (`barracks.ts`)

- **Categoria**: military
- **Função**: Futuro sistema militar. Atualmente não produz recursos nem concede bônus.

| Nível | Madeira | Pedra | Comida | Ouro | Tempo |
| ----- | ------- | ----- | ------ | ---- | ----- |
| 1     | 80      | 60    | 30     | 0    | 150s  |
| 2     | 200     | 180   | 100    | 30   | 420s  |
| 3     | 500     | 500   | 300    | 100  | 840s  |

---

### Prefeitura (`prefeitura.ts`)

- **Categoria**: headquarters
- **Função**: Reduz o tempo de construção de TODOS os edifícios. Quanto maior o nível, maior a redução.

| Nível | Madeira | Pedra | Comida | Ouro | Tempo | Redução de Construção |
| ----- | ------- | ----- | ------ | ---- | ----- | --------------------- |
| 1     | 30      | 25    | 10     | 0    | 40s   | −15%                  |
| 2     | 90      | 70    | 25     | 5    | 120s  | −30%                  |
| 3     | 250     | 200   | 60     | 25   | 360s  | −50%                  |

**Mecânica especial**: O bônus de `constructionSpeedBonus` é somado de todos os edifícios e o tempo de construção é multiplicado por `(1 - totalBonus)`. O mínimo é `0.1` (nunca menor que 10% do tempo original). Atualmente apenas a Prefeitura tem esse bônus, mas o sistema é genérico.

Exemplo: Com Prefeitura nível 2 (30% de bônus), uma construção de 240s levaria 240 \* 0.70 = 168s.

---

## 6. Engine do Jogo (`engine.ts`)

O arquivo `src/features/game-engine/engine.ts` contém toda a lógica do jogo como funções puras. Nenhuma função aqui causa efeito colateral — todas recebem estado e retornam novo estado sem mutação.

### Constantes

```ts
RESOURCE_KINDS = ['wood', 'stone', 'food', 'gold'];
GAME_STATE_VERSION = 1;
MAX_OFFLINE_SECONDS = 28800; // 8 horas
```

### Funções Utilitárias Internas

Funções privadas usadas internamente:

- `zeroAmount()` → `{ wood: 0, stone: 0, food: 0, gold: 0 }`
- `addAmounts(a, b)` → soma dois `ResourceAmount`, onde `b` pode ser parcial
- `subtractAmounts(a, b)` → subtrai `b` de `a`
- `clampToMax(amount, cap)` → limita cada recurso ao seu máximo
- `scaleAmount(amount, multiplier)` → multiplica todos os campos por um número

### Funções Públicas

#### `calculateProduction(buildings, castleGoldRate = 0): ResourceAmount`

Soma a produção por tick de todos os edifícios construídos (level > 0). Para o castelo especificamente, substitui o campo `gold` pelo valor de `castleGoldRate` (a taxa ajustável pelo slider), em vez do valor fixo da definição.

#### `calculateConstructionTimeMultiplier(buildings): number`

Soma todos os `constructionSpeedBonus` dos edifícios construídos e retorna `max(0.1, 1 - totalBonus)`. Esse multiplicador é aplicado ao `buildTimeSeconds` no momento de iniciar uma construção. Garante que o tempo mínimo seja 10% do original.

#### `calculateStorageCaps(buildings): ResourceAmount`

Soma todos os `storageBonus` dos edifícios construídos para calcular a capacidade máxima de cada recurso.

#### `createInitialGameState(now): GameState`

Cria o estado inicial do jogo. O castelo começa no nível 1, todos os outros edifícios no nível 0. Recursos iniciais: 50 madeira, 30 pedra, 20 comida, 0 ouro. `castleGoldRate` inicia em 0.

#### `canAfford(current, cost): boolean`

Verifica se `current[kind] >= cost[kind]` para todos os 4 recursos.

#### `deductCost(current, cost): ResourceAmount`

Subtrai o custo dos recursos atuais, com mínimo 0 em cada campo.

#### `rescaleQueueForSpeedChange(state, now, oldSpeed, newSpeed): GameState`

Quando a velocidade do jogo muda, ajusta os timestamps de conclusão das construções em fila. O tempo restante real é recalculado: `remainingMs * oldSpeed / newSpeed`.

#### `startConstruction(state, buildingId, now, speed): ConstructionResult`

Tenta iniciar a construção de um edifício. Valida:

1. Fila está vazia (máximo 1 construção simultânea)
2. Edifício não está no nível máximo (3)
3. O próximo nível não excede `maxLevel` da definição
4. O jogador tem recursos suficientes

Se válido: deduz o custo, cria `BuildQueueEntry` com `completesAt = now + (buildTimeSeconds * 1000 * constructionMultiplier) / speed`, retorna novo estado.

#### `processCompletedBuildings(state, now): GameState`

Verifica todos os entries da fila de construção cujo `completesAt <= now`. Para cada um, atualiza o `level` do edifício. Recalcula `max` de storage. Remove entradas concluídas da fila. Os recursos atuais são clampados ao novo máximo.

#### `applyProductionTick(state, now): GameState`

Calcula a produção (usando `castleGoldRate` do estado) e soma aos recursos atuais, respeitando o máximo.

#### `tick(state, now): GameState`

Combina `processCompletedBuildings` + `applyProductionTick`. É chamado a cada segundo (ou mais rápido dependendo da velocidade do jogo).

#### `calculateOfflineProgress(state, now): GameState`

Simula o tempo que o jogador ficou offline, até `MAX_OFFLINE_SECONDS`. O algoritmo:

1. Calcula quantos segundos passaram desde `lastSavedAt`
2. Ordena a fila de construção por `completesAt`
3. Para cada construção que terminaria no período offline:
   - Simula a produção até o momento da conclusão
   - Processa a conclusão do edifício
4. Simula a produção do tempo restante após a última conclusão
5. Retorna o estado com todos os recursos e edifícios atualizados

#### `safeParseGameState(raw): GameState | null`

Valida o JSON recuperado do `localStorage`. Verifica:

- É um objeto não-nulo
- `version === GAME_STATE_VERSION` (atualmente 1)
- Campos obrigatórios presentes com tipos corretos

Compatibilidade retroativa: se `castleGoldRate` não existir no save antigo, injeta o valor `0` sem quebrar.

---

## 7. Estado Global — Átomos Jotai

### `gameAtoms.ts`

#### `gameStateAtom` (atomWithStorage)

Átomo principal. Persistido em `localStorage` com a chave `'galadur-state'`. Usa `safeParseGameState` ao carregar — se o schema for inválido ou de versão incompatível, reseta para o estado inicial.

#### Átomos Derivados (leitura)

| Átomo                | Derivado de                                      | Tipo                                |
| -------------------- | ------------------------------------------------ | ----------------------------------- |
| `resourcesAtom`      | `gameStateAtom.resources`                        | `ResourceStore`                     |
| `buildingsAtom`      | `gameStateAtom.buildings`                        | `Record<BuildingId, BuildingState>` |
| `buildQueueAtom`     | `gameStateAtom.buildQueue`                       | `BuildQueueEntry[]`                 |
| `activeBuildAtom`    | `buildQueueAtom[0]`                              | `BuildQueueEntry \| null`           |
| `isConstructingAtom` | `buildQueueAtom.length > 0`                      | `boolean`                           |
| `lastSavedAtAtom`    | `gameStateAtom.lastSavedAt`                      | `number`                            |
| `castleGoldRateAtom` | `gameStateAtom.castleGoldRate`                   | `number`                            |
| `productionAtom`     | `calculateProduction(buildings, castleGoldRate)` | `ResourceAmount`                    |
| `gameDayAtom`        | `tickCountAtom + 1`                              | `number`                            |

#### Átomos de Controle

| Átomo           | Tipo        | Default | Descrição                                |
| --------------- | ----------- | ------- | ---------------------------------------- |
| `tickCountAtom` | `number`    | `0`     | Contador de ticks desde abertura do jogo |
| `gameSpeedAtom` | `GameSpeed` | `1`     | Velocidade do jogo (0, 0.5, 1, 2, 4)     |

### `eventLogAtom.ts`

```ts
interface GameEvent {
  timestamp: number;
  message: string;
}

const eventLogAtom = atom<GameEvent[]>([]);
```

Não é persistido. Armazena eventos da sessão atual (início de construções, conclusões). É usado por `useGameLoop` e `useUpgrade` para adicionar entradas, e por `RecentEvents` para exibir os últimos 5.

---

## 8. Hooks do Game Engine

### `useGameLoop.ts`

Hook chamado uma vez, em `providers.tsx`, dentro de `GameLoopInitializer`. Não retorna nada. Seus efeitos:

1. **Na montagem**: chama `applyOffline()` uma vez para processar progresso offline.
2. **Quando `speed` muda**: chama `applySpeedChange(oldSpeed, newSpeed)` para ajustar a fila.
3. **A cada `1000ms / speed`** (ou pausado se `speed === 0`): chama `runTick()` que:
   - Executa `tick(state, now)` e atualiza `gameStateAtom`
   - Incrementa `tickCountAtom`
   - Identifica construções que acabaram de completar e as loga em `eventLogAtom`

### `useUpgrade.ts`

Retorna uma função `(buildingId) => ConstructionResult` via `useAtomCallback`. Ao ser chamada:

1. Lê estado atual e velocidade do jogo
2. Chama `startConstruction(state, buildingId, now, speed)`
3. Se sucesso: salva novo estado no `gameStateAtom`, loga evento de início
4. Retorna o resultado (componente pode reagir ao erro)

---

## 9. Hooks de Feature

### `useBuildingCard.ts` (`building/card/hooks`)

Usado por `BuildingCard`. Recebe o `BuildingState`. Retorna `def`, `currentLevelDef`, `activeEntry` (entrada na fila, se houver) e `upgradeStatus`, o texto de situação mostrado no card ("Pronto para evoluir para nível 2", "Recursos insuficientes para evoluir", "Fila de construção ocupada", "Nível máximo").

### `useBuildingModal.ts` (`building/modal/hooks`)

Usado por `BuildingModal`. Recebe `buildingId` e `onClose`. Retorna `building`, `def`, `resources`, `currentLevelDef`, `nextLevelDef`, `isMaxLevel`, `isConstructing`, `upgradeDisabled` e `handleUpgrade()`, que chama `useUpgrade` e fecha o modal.

### `useCastleGoldRate.ts` (`building/castle/hooks`)

Usado por `CastleGoldSlider`. Retorna `rate`, `maxRate` (do nível atual do castelo) e `setRate(newRate)`, que escreve `castleGoldRate` no `gameStateAtom`.

### `useMarketTrade.ts` (`building/market/hooks`)

Executa a troca na engine e, quando ela dá certo, anuncia um evento para o recurso negociado e para o ouro, o que faz os medidores piscarem.

### `useArmyActions.ts` (`army/hooks`)

Controla inimigo selecionado, mobilização e resultado da batalha. Ao resolver a batalha, registra a mensagem no log e anuncia o saque como evento de recurso.

---

## 10. Componentes de UI

Toda a interface usa componentes do mwds. Os mais usados e onde aparecem:

| Componente do mwds                                     | Uso no jogo                                                           |
| ------------------------------------------------------ | --------------------------------------------------------------------- |
| `AppShell` (`mobileNav="bottom"`, breakpoint `md`)     | Casca: sidebar no desktop, abas no rodapé no mobile, resumo à direita |
| `Meter`                                                | HUD de recursos; `compact` no mobile; `highlightKey` em eventos       |
| `ToggleGroup`                                          | Velocidade do jogo (pausa, 0,5x a 4x)                                 |
| `Card` + `CardAction` + `IconTile`                     | Cards de edifício (card inteiro clicável) e de inimigo                |
| `Dialog`                                               | Modal de edifício, mobilização e resultado da batalha                 |
| `Progress` com `valueText`                             | Construção e treino ("12 s restantes")                                |
| `Slider` + `FormField`                                 | Produção de ouro do castelo                                           |
| `NumberInput`                                          | Quantidade no mercado e na mobilização, com rótulos por recurso/tropa |
| `PageHeader`, `DescriptionList`, `EmptyState`, `Alert` | Títulos de página, status do império, fila vazia, dica                |
| `Badge`                                                | "em breve", "derrotado", "bloqueado" e contagem ×N                    |
| `ThemeToggle`                                          | Tema claro, escuro ou do sistema, no fim do painel de resumo          |

### Layout (`GameLayout.tsx`)

`AppShell` com `AppShellSidebar` (marca e navegação), `AppShellHeader` (HUD), `AppShellMain` (cidade ou exército, com `animate-mw-fade-in` na troca) e `AppShellAside` (resumo). Os itens de navegação são escritos direto no JSX do layout, porque o `AppShell` só conta itens que estão na árvore para decidir pela barra inferior (de 3 a 5 itens). "pesquisa" e "configurações" aparecem desabilitados com "em breve".

O jogo é renderizado só no cliente (`GameClient` com `next/dynamic` e `ssr: false`), porque o átomo do save lê o `localStorage` durante a renderização.

### Feedback de movimento

- **Flash (`animate-mw-flash`)**: o `Meter` pisca quando o `highlightKey` do recurso muda. O contador vem de `resourceEventsAtom`, incrementado só por eventos discretos (compra e venda no mercado, saque de batalha), nunca pela produção contínua.
- **Glitch (`animate-mw-glitch`)**: o botão "Evoluir para nível N" usa `aria-disabled` e, ao ser clicado sem condições, toca o glitch uma vez.

---

## 11. Estilo Visual

A identidade é a do design system mwds, aplicada à risca: tokens semânticos (`bg-ground`, `text-ink`, `accent`...), temas claro e escuro, fontes Bricolage Grotesque, IBM Plex Sans e IBM Plex Mono. O modo estrito (`mw-strict.css` + regras `mw/*` no ESLint) zera a paleta padrão do Tailwind, então só tokens funcionam.

Cada recurso tem um ícone do lucide e uma cor de categoria, sempre acompanhada do nome (a cor nunca é a única pista):

| Recurso | Ícone      | Categoria              |
| ------- | ---------- | ---------------------- |
| Madeira | `TreePine` | `category-2` (verde)   |
| Pedra   | `Mountain` | `category-1` (azul)    |
| Comida  | `Wheat`    | `category-4` (laranja) |
| Ouro    | `Coins`    | `category-7` (amarelo) |

Os edifícios usam `Castle`, `Tractor` (fazenda), `Axe` (serraria), `Pickaxe` (mina), `Store` (mercado), `Tent` (quartel) e `Landmark` (prefeitura). As unidades usam `Sword` (guerreiro), `BowArrow` (arqueiro) e `Shield` (lanceiro, porque o lucide não tem lança).

---

## 12. Fluxo de Dados — Diagrama Textual

```
localStorage
    ↓ (na montagem)
gameStateAtom  ←──────────────────────────────────────────────┐
    │                                                          │
    ├─→ resourcesAtom                                         │
    ├─→ buildingsAtom ──→ productionAtom                      │
    ├─→ buildQueueAtom ──→ activeBuildAtom, isConstructingAtom │
    ├─→ castleGoldRateAtom ──→ productionAtom                 │
    └─→ lastSavedAtAtom                                       │
                                                              │
useGameLoop (a cada 1s/speed)                                 │
    → tick(state, now)                                        │
    → set(gameStateAtom, newState) ───────────────────────────┘

useUpgrade (ao clicar em upgrade)
    → startConstruction(state, id, now, speed)
    → set(gameStateAtom, newState) ───────────────────────────┘

useCastleGoldRate.setRate(newRate) (ao mover slider)
    → set(gameStateAtom, {...state, castleGoldRate: newRate}) ─┘
```

---

## 13. Salvamento e Persistência

O `gameStateAtom` usa `atomWithStorage` do Jotai com storage customizado. O `getItem` customizado:

1. Lê o JSON do `localStorage`
2. Faz parse
3. Chama `safeParseGameState(parsed)` para validar
4. Se válido: retorna o estado; se inválido (versão errada, campos ausentes): reseta para inicial
5. Trata exceções com silêncio (retorna `initialValue`)

O `setItem` é o comportamento padrão do Jotai — escreve a cada atualização do átomo. Como `gameStateAtom` é atualizado a cada tick (1 segundo), o `localStorage` é escrito com essa frequência.

### Compatibilidade Retroativa

Quando um novo campo é adicionado ao `GameState` (exemplo: `castleGoldRate`), o `safeParseGameState` pode injetar um valor padrão para saves antigos sem o campo, sem precisar incrementar `GAME_STATE_VERSION`. O incremento de versão só é necessário quando a estrutura muda de forma incompatível.

---

## 14. Progressão Offline

Ao abrir o jogo após um período offline, `useGameLoop` chama `applyOffline()` uma vez (controlado por `offlineAppliedRef`).

`calculateOfflineProgress` simula o tempo offline:

1. Calcula `elapsedSeconds = (now - lastSavedAt) / 1000`
2. Limita a `MAX_OFFLINE_SECONDS = 28800` (8h)
3. Ordena a fila de construção por `completesAt`
4. Processa segment por segment:
   - Simula produção de recursos até o próximo evento de conclusão
   - Conclui o edifício (atualiza level, recalcula storage)
5. Simula produção do tempo após o último evento até o final
6. Retorna estado atualizado

Isso garante que se, por exemplo, o jogador ficou offline 2h e 3 edifícios terminaram, todos são corretamente completados na ordem certa e a produção de cada segmento usa os bônus corretos de cada fase.

---

## 15. Velocidade do Jogo

O tipo `GameSpeed = 0 | 0.5 | 1 | 2 | 4`. O valor é armazenado em `gameSpeedAtom`.

- **0**: Pausa total. O `setInterval` não é criado.
- **0.5×**: Ticks a cada 2 segundos (tempo real mais lento que o jogo)
- **1×**: Normal, tick a cada 1s
- **2×**: Ticks a cada 500ms
- **4×**: Ticks a cada 250ms

Quando a velocidade muda, `rescaleQueueForSpeedChange` ajusta os `completesAt` de todas as construções em fila proporcionalmente: `remainingMs * oldSpeed / newSpeed`.

---

## 16. Fila de Construção

O jogo suporta apenas **1 construção por vez**. A fila (`buildQueue`) é um array mas na prática tem 0 ou 1 item.

Regras:

- `startConstruction` retorna `{ success: false, error: 'queue_full' }` se já houver 1 item
- Um edifício não pode ter 2 construções simultâneas pelo mesmo motivo
- Ao completar, o entry é removido da fila e o `level` do edifício é incrementado

---

## 17. Convenções de Código (resumo do CLAUDE.md)

- **Proibido**: comentários de qualquer tipo (`//`, `/* */`, `/** */`) no código do Galadur
- **Proibido**: `any` — usar `unknown` com narrowing
- **Props de componentes**: sempre `interface`, nunca inline ou `type`
- **Nomes de componentes**: descrevem o domínio, não a estrutura visual
- **Tags HTML**: semânticas onde possível (`<section>`, `<article>`, `<ul>/<li>`, etc.)
- **Limite de linhas**: 80 por arquivo (teto absoluto)
- **Estado global**: Jotai. Estado local de UI: `useState`
- **Imports entre features**: proibido (`features/X` não importa de `features/Y`)
- **UI**: componentes e tokens do mwds; nada de cor, raio, sombra ou curva fora dos tokens
- **Exceção**: arquivos gerados pelo registry (`src/components/ui`, `globals.css`, `lib/utils.ts`, `eslint-rules`) ficam fora do teto de linhas, da proibição de comentários e do Prettier

---

## 18. Pontos de Extensão Futuros (inferidos da estrutura)

- **Pesquisa e configurações**: aparecem na navegação como "em breve"
- **Rotas**: o jogo é uma página só; a navegação troca a tela por `activePageAtom`
- **Mais edifícios**: `BuildingId` pode crescer. `ALL_BUILDING_IDS` é derivado automaticamente de `BUILDING_DEFINITIONS`
- **Mais velocidades**: `GameSpeed` é um tipo union — novas velocidades só precisam ser adicionadas ao tipo e ao componente de controle
- **Log persistido**: `eventLogAtom` não persiste — poderia ser movido para `gameStateAtom` ou para localStorage separado
- **Múltiplas filas**: a arquitetura suporta múltiplos entries em `buildQueue`, mas a lógica de `startConstruction` bloqueia em 1

---

## 19. Estado Inicial do Jogo

Quando o jogador abre pela primeira vez (sem save):

```
Edifícios:
  castle: level 1
  farm: level 0
  sawmill: level 0
  mine: level 0
  market: level 0
  barracks: level 0
  prefeitura: level 0

Recursos iniciais:
  wood: 50, stone: 30, food: 20, gold: 0

Armazenamento máximo (vem do castelo nível 1):
  wood: 200, stone: 200, food: 200, gold: 100

Produção inicial (castelo nível 1, castleGoldRate = 0):
  wood: +0.5/s, stone: +0.3/s, food: +0.3/s, gold: +0/s

castleGoldRate: 0
buildQueue: []
```

---

## 20. Resumo de Arquivos por Responsabilidade

| Responsabilidade           | Arquivo(s)                                                          |
| -------------------------- | ------------------------------------------------------------------- |
| Tipos do domínio           | `game-engine/types.ts`                                              |
| Lógica pura do jogo        | `game-engine/engine.ts`                                             |
| Loop de ticks              | `game-engine/hooks/useGameLoop.ts`                                  |
| Iniciar construção         | `game-engine/hooks/useUpgrade.ts`                                   |
| Estado global              | `store/gameAtoms.ts`                                                |
| Log de eventos             | `store/eventLogAtom.ts`                                             |
| Eventos de recurso (flash) | `store/resourceEventsAtom.ts`                                       |
| Formatação pt-BR           | `lib/format.ts`, `game/resource/resourceNames.ts`                   |
| Definição de edifícios     | `config/buildings/*.ts`                                             |
| Carregamento no cliente    | `game/GameClient.tsx`                                               |
| Layout principal           | `game/components/GameLayout.tsx`                                    |
| Navegação                  | `game/navigation/hooks/useGameNavigation.tsx`                       |
| Grade de edifícios         | `game/building/BuildingGrid.tsx`                                    |
| Modal de edifício          | `game/building/modal/components/BuildingModal.tsx`                  |
| Slider de ouro do castelo  | `game/building/castle/components/CastleGoldSlider.tsx`              |
| Bônus da prefeitura        | `game/building/prefeitura/components/PrefeituraSpeedInfo.tsx`       |
| Extras do modal            | `game/building/BuildingExtra.tsx`                                   |
| HUD de recursos            | `game/resource/components/ResourceHUD.tsx`                          |
| Controles de velocidade    | `game/resource/components/GameSpeedControls.tsx`                    |
| Fila de construção         | `game/construction/components/ConstructionQueue.tsx`                |
| Status do império          | `game/empire/components/EmpireStats.tsx`                            |
| Exército                   | `game/army/ArmyPage.tsx`                                            |
| Ícones de domínio          | `game/components/*Icon.tsx`, `resource/components/ResourceIcon.tsx` |
