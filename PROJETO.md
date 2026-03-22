# Galadur — Documentação Completa do Projeto

> Gerado em 2026-03-21. Descreve o estado atual do projeto com detalhes sobre arquitetura, mecânicas, tipos, lógica de engine, componentes, átomos de estado e convenções de código.

---

## 1. Visão Geral

**Galadur** é um jogo incremental/idle com temática medieval, desenvolvido como aplicação web com React. O jogador gerencia um império que começa com um castelo nível 1 e recursos iniciais modestos (50 madeira, 30 pedra, 20 comida, 0 ouro). A progressão é feita construindo e evoluindo edifícios que produzem recursos passivamente ao longo do tempo, financiando construções cada vez mais caras.

O jogo roda inteiramente no navegador, sem backend. Todo estado é persistido no `localStorage` e sobrevive ao fechamento do navegador. Há suporte a progressão offline: ao reabrir o jogo, o tempo que passou é simulado retroativamente (limitado a 8 horas).

---

## 2. Stack de Tecnologias

| Ferramenta     | Versão         | Função                              |
|----------------|----------------|-------------------------------------|
| React          | 18.3.1         | Biblioteca de UI                    |
| Vite           | 5.x            | Bundler e servidor de desenvolvimento |
| TypeScript     | 5.7.2          | Tipagem estática                    |
| Tailwind CSS   | 3.4.17         | Estilização via classes utilitárias |
| shadcn/ui      | —              | Componentes base (Dialog, Button)   |
| @base-ui/react | —              | Primitivos headless para Dialog/Progress |
| Jotai          | 2.11.0         | Gerenciamento de estado global      |
| Wouter         | 3.3.5          | Roteamento (atualmente não utilizado ativamente) |
| lucide-react   | —              | Ícones SVG                          |
| clsx           | —              | Composição condicional de classes   |
| tailwind-merge | —              | Fusão segura de classes Tailwind    |

---

## 3. Estrutura de Pastas

```
galadur/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── eslint.config.js
├── CLAUDE.md                          ← Regras técnicas do projeto
├── PROJETO.md                         ← Este arquivo
│
└── src/
    ├── main.tsx                       ← Entry point React
    ├── App.tsx                        ← Raiz da aplicação
    ├── index.css                      ← Variáveis CSS + Tailwind
    │
    ├── app/
    │   └── providers.tsx              ← Jotai Provider + inicializador do game loop
    │
    ├── config/
    │   └── buildings/
    │       ├── index.ts               ← Exporta BUILDING_DEFINITIONS, ALL_BUILDING_IDS, getBuildingLevelDef
    │       ├── castle.ts              ← Definição do Castelo
    │       ├── farm.ts                ← Definição da Fazenda
    │       ├── sawmill.ts             ← Definição da Serraria
    │       ├── mine.ts                ← Definição da Mina
    │       ├── market.ts              ← Definição do Mercado
    │       ├── barracks.ts            ← Definição dos Quartéis
    │       └── prefeitura.ts          ← Definição da Prefeitura
    │
    ├── features/
    │   ├── game-engine/
    │   │   ├── types.ts               ← Todos os tipos do domínio
    │   │   ├── engine.ts              ← Lógica pura do jogo (funções sem efeito colateral)
    │   │   └── hooks/
    │   │       ├── useGameLoop.ts     ← Hook que dirige o loop do jogo (ticks)
    │   │       └── useUpgrade.ts      ← Hook para iniciar construções
    │   │
    │   └── game/
    │       ├── components/
    │       │   ├── GameLayout.tsx          ← Layout de 3 colunas
    │       │   ├── GameSummaryPanel.tsx    ← Painel direito
    │       │   ├── EventLog.tsx            ← Log de eventos (componente existente)
    │       │   ├── ProgressBar.tsx         ← Barra de progresso reutilizável
    │       │   ├── BuildingIcon.tsx        ← Dispatcher de ícones por BuildingId
    │       │   ├── ResourceIcon.tsx        ← Ícones SVG dos 4 recursos
    │       │   └── icons/
    │       │       ├── CastleIcon.tsx
    │       │       ├── FarmIcon.tsx
    │       │       ├── SawmillIcon.tsx
    │       │       ├── MineIcon.tsx
    │       │       ├── MarketIcon.tsx
    │       │       ├── PrefeituraIcon.tsx
    │       │       └── DefaultBuildingIcon.tsx
    │       │
    │       ├── building/
    │       │   ├── components/
    │       │   │   ├── BuildingGrid.tsx         ← Grade de cards de edifícios
    │       │   │   ├── BuildingCard.tsx         ← Card individual de edifício
    │       │   │   ├── BuildingModal.tsx         ← Modal de detalhes/upgrade
    │       │   │   ├── BuildingIdentity.tsx      ← Cabeçalho do modal (ícone + nome + nível)
    │       │   │   ├── BuildingStats.tsx         ← Stats compactos
    │       │   │   ├── BuildingProductionStats.tsx ← Produção atual no modal
    │       │   │   ├── BuildingUpgradeCosts.tsx  ← Custos e tempo do próximo nível
    │       │   │   ├── BuildingUpgradeActions.tsx ← Botões de ação do modal
    │       │   │   ├── BuildingUpgradeButton.tsx ← Botão de upgrade isolado
    │       │   │   ├── BuildingExtra.tsx         ← Conteúdo extra específico por edifício
    │       │   │   ├── CastleGoldSlider.tsx      ← Slider de produção de ouro do castelo
    │       │   │   └── PrefeituraSpeedInfo.tsx   ← Info do bônus de velocidade de construção
    │       │   └── hooks/
    │       │       ├── useBuildingCard.ts        ← Lógica do card
    │       │       ├── useBuildingModal.ts        ← Lógica do modal
    │       │       └── useCastleGoldRate.ts       ← Leitura/escrita da taxa de ouro do castelo
    │       │
    │       ├── construction/
    │       │   └── components/
    │       │       └── ConstructionQueue.tsx     ← Fila de construção ativa
    │       │
    │       ├── empire/
    │       │   └── components/
    │       │       ├── EmpireStats.tsx           ← Estatísticas do império
    │       │       ├── RecentEvents.tsx           ← Últimos 5 eventos
    │       │       └── GameTip.tsx                ← Dica estática
    │       │
    │       ├── navigation/
    │       │   └── components/
    │       │       ├── GameSidebar.tsx            ← Barra lateral esquerda
    │       │       └── GameNavItem.tsx            ← Item de navegação
    │       │
    │       └── resource/
    │           └── components/
    │               ├── ResourceHUD.tsx            ← HUD de recursos no topo
    │               ├── ResourceBar.tsx            ← Barra individual de recurso
    │               ├── GameDayCounter.tsx         ← Contador de dias de jogo
    │               ├── GameSpeedControls.tsx      ← Controles de velocidade
    │               └── resourceConfig.ts          ← Configuração visual dos recursos
    │
    ├── store/
    │   ├── gameAtoms.ts               ← Átomos Jotai do estado do jogo
    │   └── eventLogAtom.ts            ← Átomo do log de eventos
    │
    ├── components/
    │   └── ui/
    │       ├── button.tsx             ← Button shadcn
    │       ├── dialog.tsx             ← Dialog shadcn
    │       └── progress.tsx           ← Progress shadcn
    │
    └── lib/
        └── utils.ts                   ← Função cn() (clsx + tailwind-merge)
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
  current: ResourceAmount;  // quanto o jogador tem agora
  max: ResourceAmount;      // capacidade máxima de armazenamento
}
```

### Edifícios

```ts
type BuildingId =
  | 'castle'
  | 'farm'
  | 'sawmill'
  | 'mine'
  | 'market'
  | 'barracks'
  | 'prefeitura';

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
  productionPerTick: Partial<ResourceAmount>;  // produção por segundo
  storageBonus: Partial<ResourceAmount>;        // bônus de armazenamento adicionado
  constructionSpeedBonus?: number;              // fração de redução no tempo de construção (0.15 = 15% mais rápido)
}

interface BuildingLevelDefinition {
  level: Exclude<BuildingLevel, 0>;   // 1 | 2 | 3
  cost: ResourceAmount;               // custo para construir/upar
  buildTimeSeconds: number;           // tempo base de construção em segundos
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
  startedAt: number;    // timestamp em ms (Date.now())
  completesAt: number;  // timestamp em ms quando termina
}

interface GameState {
  resources: ResourceStore;
  buildings: Record<BuildingId, BuildingState>;
  buildQueue: BuildQueueEntry[];
  lastSavedAt: number;       // timestamp da última atualização
  version: number;           // versão do schema (atual: 1)
  castleGoldRate: number;    // produção de ouro configurada no castelo (0 a maxRate)
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

| Nível | Madeira | Pedra | Comida | Ouro | Tempo  | Prod./tick (mad/ped/com/ouro) | Storage |
|-------|---------|-------|--------|------|--------|-------------------------------|---------|
| 1     | 0       | 0     | 0      | 0    | 0s     | +0.5 / +0.3 / +0.3 / ajustável | +200/+200/+200/+100 |
| 2     | 40      | 50    | 15     | 0    | 45s    | +1.0 / +0.6 / +0.6 / ajustável (max 0.1) | +500/+500/+500/+300 |
| 3     | 120     | 180   | 60     | 15   | 240s   | +2.0 / +1.2 / +1.2 / ajustável (max 0.3) | +1500/+1500/+1500/+1000 |

**Mecânica especial**: O ouro produzido pelo castelo não é fixo. O jogador ajusta um slider no modal do castelo que vai de 0 até o valor máximo do nível atual. Isso permite controle sobre o quanto de capacidade de produção de ouro é alocada. O valor é persistido em `gameState.castleGoldRate`.

---

### Fazenda (`farm.ts`)

- **Categoria**: producer
- **Função**: Produz comida.

| Nível | Madeira | Pedra | Comida | Ouro | Tempo  | Comida/tick |
|-------|---------|-------|--------|------|--------|-------------|
| 1     | 30      | 10    | 0      | 0    | 60s    | +0.5        |
| 2     | 80      | 30    | 0      | 0    | 180s   | +1.5        |
| 3     | 200     | 100   | 0      | 20   | 480s   | +4.0        |

---

### Serraria (`sawmill.ts`)

- **Categoria**: producer
- **Função**: Produz madeira.

| Nível | Madeira | Pedra | Comida | Ouro | Tempo  | Madeira/tick |
|-------|---------|-------|--------|------|--------|--------------|
| 1     | 0       | 15    | 5      | 0    | 60s    | +0.5         |
| 2     | 60      | 50    | 15     | 0    | 200s   | +1.5         |
| 3     | 150     | 150   | 50     | 30   | 500s   | +4.0         |

---

### Mina (`mine.ts`)

- **Categoria**: producer
- **Função**: Produz pedra.

| Nível | Madeira | Pedra | Comida | Ouro | Tempo  | Pedra/tick |
|-------|---------|-------|--------|------|--------|------------|
| 1     | 40      | 0     | 10     | 0    | 90s    | +0.4       |
| 2     | 100     | 20    | 30     | 0    | 240s   | +1.2       |
| 3     | 250     | 60    | 80     | 50   | 600s   | +3.5       |

---

### Mercado (`market.ts`)

- **Categoria**: producer
- **Função**: Produz ouro de forma fixa (diferente do castelo que é ajustável).

| Nível | Madeira | Pedra | Comida | Ouro | Tempo  | Ouro/tick |
|-------|---------|-------|--------|------|--------|-----------|
| 1     | 60      | 40    | 20     | 0    | 120s   | +0.2      |
| 2     | 150     | 120   | 60     | 10   | 360s   | +0.6      |
| 3     | 400     | 300   | 150    | 50   | 720s   | +1.5      |

---

### Quartéis (`barracks.ts`)

- **Categoria**: military
- **Função**: Futuro sistema militar. Atualmente não produz recursos nem concede bônus.

| Nível | Madeira | Pedra | Comida | Ouro | Tempo  |
|-------|---------|-------|--------|------|--------|
| 1     | 80      | 60    | 30     | 0    | 150s   |
| 2     | 200     | 180   | 100    | 30   | 420s   |
| 3     | 500     | 500   | 300    | 100  | 840s   |

---

### Prefeitura (`prefeitura.ts`)

- **Categoria**: headquarters
- **Função**: Reduz o tempo de construção de TODOS os edifícios. Quanto maior o nível, maior a redução.

| Nível | Madeira | Pedra | Comida | Ouro | Tempo  | Redução de Construção |
|-------|---------|-------|--------|------|--------|-----------------------|
| 1     | 30      | 25    | 10     | 0    | 40s    | −15%                  |
| 2     | 90      | 70    | 25     | 5    | 120s   | −30%                  |
| 3     | 250     | 200   | 60     | 25   | 360s   | −50%                  |

**Mecânica especial**: O bônus de `constructionSpeedBonus` é somado de todos os edifícios e o tempo de construção é multiplicado por `(1 - totalBonus)`. O mínimo é `0.1` (nunca menor que 10% do tempo original). Atualmente apenas a Prefeitura tem esse bônus, mas o sistema é genérico.

Exemplo: Com Prefeitura nível 2 (30% de bônus), uma construção de 240s levaria 240 * 0.70 = 168s.

---

## 6. Engine do Jogo (`engine.ts`)

O arquivo `src/features/game-engine/engine.ts` contém toda a lógica do jogo como funções puras. Nenhuma função aqui causa efeito colateral — todas recebem estado e retornam novo estado sem mutação.

### Constantes

```ts
RESOURCE_KINDS = ['wood', 'stone', 'food', 'gold']
GAME_STATE_VERSION = 1
MAX_OFFLINE_SECONDS = 28800  // 8 horas
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

| Átomo | Derivado de | Tipo |
|-------|-------------|------|
| `resourcesAtom` | `gameStateAtom.resources` | `ResourceStore` |
| `buildingsAtom` | `gameStateAtom.buildings` | `Record<BuildingId, BuildingState>` |
| `buildQueueAtom` | `gameStateAtom.buildQueue` | `BuildQueueEntry[]` |
| `activeBuildAtom` | `buildQueueAtom[0]` | `BuildQueueEntry \| null` |
| `isConstructingAtom` | `buildQueueAtom.length > 0` | `boolean` |
| `lastSavedAtAtom` | `gameStateAtom.lastSavedAt` | `number` |
| `castleGoldRateAtom` | `gameStateAtom.castleGoldRate` | `number` |
| `productionAtom` | `calculateProduction(buildings, castleGoldRate)` | `ResourceAmount` |
| `gameDayAtom` | `tickCountAtom + 1` | `number` |

#### Átomos de Controle

| Átomo | Tipo | Default | Descrição |
|-------|------|---------|-----------|
| `tickCountAtom` | `number` | `0` | Contador de ticks desde abertura do jogo |
| `gameSpeedAtom` | `GameSpeed` | `1` | Velocidade do jogo (0, 0.5, 1, 2, 4) |

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

### `useBuildingCard.ts`

Usado por `BuildingCard`. Recebe `buildingId`. Retorna:
- `building`: estado atual (`level`)
- `def`: definição completa do edifício
- `currentLevelDef`: definição do nível atual (ou `null` se nível 0)
- `activeEntry`: entrada na fila se este edifício estiver em construção
- `upgradeDisabled`: `true` se max level, ou já construindo, ou sem recursos
- `upgradeLabel`: texto do botão de upgrade

### `useBuildingModal.ts`

Usado por `BuildingModal`. Recebe `buildingId` e `onClose`. Retorna os mesmos dados de `useBuildingCard` mais:
- `resources`: recursos atuais do jogador
- `nextLevelDef`: definição do próximo nível (ou `null` se max)
- `isMaxLevel`, `isConstructing`
- `handleUpgrade()`: chama `useUpgrade`, fecha modal em sucesso

### `useCastleGoldRate.ts`

Usado por `CastleGoldSlider`. Retorna:
- `rate`: valor atual de `castleGoldRate`
- `maxRate`: máximo do nível atual do castelo (de `productionPerTick.gold` da definição)
- `setRate(newRate)`: escreve `castleGoldRate` direto no `gameStateAtom`

---

## 10. Componentes de UI — Detalhes

### Layout Principal

#### `GameLayout.tsx`

Layout de 3 colunas com `flex`:
- **Coluna esquerda** (estreita, fixa): `GameSidebar`
- **Coluna central** (cresce, scroll): `ResourceHUD` no topo + `BuildingGrid` embaixo
- **Coluna direita** (fixa): `GameSummaryPanel`

#### `GameSummaryPanel.tsx`

Painel direito que organiza verticalmente:
1. `EmpireStats`
2. `ConstructionQueue`
3. `RecentEvents`
4. `GameTip`

### Sub-feature: Building

#### `BuildingGrid.tsx`

- Lê `buildingsAtom` para listar todos os edifícios
- Gerencia `selectedId` (qual modal está aberto)
- Renderiza uma `<ul>` com `grid grid-cols-2`
- Cada `<li>` tem um `BuildingCard`
- Abre `BuildingModal` quando `selectedId !== null`

#### `BuildingCard.tsx`

Artigo HTML com:
- Ícone do edifício + nome + nível
- Produção atual (se level > 0)
- Barra de progresso de construção (se em fila)
- Botão de upgrade

#### `BuildingModal.tsx`

Dialog shadcn dividida em seções:
1. **Header**: `BuildingIdentity` (ícone, nome, nível, max, botão fechar)
2. **Body**:
   - Descrição em texto
   - `BuildingProductionStats`: produção atual formatada
   - `BuildingUpgradeCosts`: custo do próximo nível, tempo, produção futura
   - `BuildingExtra`: conteúdo extra específico do edifício
3. **Footer**: `BuildingUpgradeActions` (botões Fechar e Upar)

#### `BuildingExtra.tsx`

Componente de despacho sem estado. Routing por `buildingId`:
- `'castle'` → `<CastleGoldSlider />`
- `'prefeitura'` → `<PrefeituraSpeedInfo />`
- outros → `null`

#### `CastleGoldSlider.tsx`

Visível apenas quando `maxRate > 0` (Castelo nível 2 ou 3). Exibe:
- Rótulo "Produção de Ouro" e valor atual `X.XX/tick (Y%)`
- `<input type="range" min=0 max=maxRate step=0.01>`
- Rótulos de min/max

Quando o slider é movido, chama `setRate()` do `useCastleGoldRate` que escreve direto no `gameStateAtom`. O próximo tick usa o novo valor.

#### `PrefeituraSpeedInfo.tsx`

Visível apenas quando a Prefeitura está construída (nível > 0). Exibe o percentual de redução atual do edifício: "−X% no tempo de todas as construções".

### Sub-feature: Resource

#### `ResourceHUD.tsx`

Faixa de header com as 4 barras de recurso lado a lado, mais `GameDayCounter` e `GameSpeedControls`.

#### `ResourceBar.tsx`

Para cada recurso mostra:
- Ícone com cor temática
- `atual / máximo`
- Taxa de produção por segundo (`+X.X/s`)
- Barra de progresso mostrando `atual/máximo`

#### `GameSpeedControls.tsx`

Botões de velocidade: ⏸ (pause = 0), 0.5×, 1×, 2×, 4×. O botão ativo é destacado. Ao clicar, atualiza `gameSpeedAtom`.

### Sub-feature: Construction

#### `ConstructionQueue.tsx`

Seção com título "Em Construção". Se não há builds ativos, exibe "Nenhuma construção em andamento". Para cada entry na fila mostra ícone do edifício, nome, nível alvo, e barra de progresso com tempo restante.

### Sub-feature: Empire

#### `EmpireStats.tsx`

Calcula:
- Total de edifícios construídos (level > 0)
- Soma de todos os níveis
- "Score do Império" = soma dos níveis × 30

#### `RecentEvents.tsx`

Exibe os últimos 5 eventos do `eventLogAtom` em ordem reversa, com horário formatado.

### Sub-feature: Navigation

#### `GameSidebar.tsx`

Sidebar esquerda com:
- Logo "Galadur" com ícone
- Itens de navegação: "Cidade" (ativo), "Exército", "Pesquisa", "Configurações" (últimos 3 com badge "SOON")
- Botão de recolher sidebar

---

## 11. Estilo Visual

### Paleta de Cores

O tema é medieval/fantasia com tons escuros. As cores customizadas são definidas em `tailwind.config.ts`:

- **`realm-500`** a **`realm-950`**: escala de cinza-azulado escuro usada para fundos, bordas, textos secundários
- **`realm-950`**: fundo mais escuro (fundos de modais, cards)
- **`realm-700/800`**: bordas, separadores
- **`realm-400/500`**: textos secundários
- **`realm-300`**: textos de destaque suave
- **`white`**: textos primários

Cores de recursos:
- Madeira: tons de âmbar/amarelo
- Pedra: tons de cinza
- Comida: tons de verde
- Ouro: tons de dourado/âmbar

### Tipografia

- **Corpo**: sans-serif padrão do sistema
- **Títulos temáticos**: `font-medieval` (Cinzel, importada do Google Fonts) — usada em títulos de seção e rótulos uppercase
- **Monospace**: para logs e valores numéricos em alguns contextos

### Bordas e Cantos

`border-radius: 0rem` global — sem arredondamento de bordas em nenhum elemento. Visual mais austero/angular, coerente com o tema medieval.

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

- **Proibido**: comentários de qualquer tipo (`//`, `/* */`, `/** */`)
- **Proibido**: `any` — usar `unknown` com narrowing
- **Props de componentes**: sempre `interface`, nunca inline ou `type`
- **Nomes de componentes**: descrevem o domínio, não a estrutura visual
- **Tags HTML**: semânticas onde possível (`<section>`, `<article>`, `<ul>/<li>`, etc.)
- **Limite de linhas**: 80 por arquivo (teto absoluto)
- **Estado global**: Jotai. Estado local de UI: `useState`
- **Imports entre features**: proibido (`features/X` não importa de `features/Y`)
- **Compartilhado**: vai em `components/` ou `lib/`
- **Sem CSS customizado**: Tailwind primeiro

---

## 18. Pontos de Extensão Futuros (inferidos da estrutura)

- **Sistema militar**: `barracks.ts` existe mas não tem mecânica. A categoria `'military'` está reservada. `GameSidebar` tem "Exército" como item futuro.
- **Pesquisa**: sidebar tem "Pesquisa" como futuro
- **Rotas**: Wouter está instalado mas não há múltiplas rotas ativas ainda
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

| Responsabilidade | Arquivo(s) |
|------------------|------------|
| Tipos do domínio | `game-engine/types.ts` |
| Lógica pura do jogo | `game-engine/engine.ts` |
| Loop de ticks | `game-engine/hooks/useGameLoop.ts` |
| Iniciar construção | `game-engine/hooks/useUpgrade.ts` |
| Estado global | `store/gameAtoms.ts` |
| Log de eventos | `store/eventLogAtom.ts` |
| Definição de edifícios | `config/buildings/*.ts` |
| Layout principal | `game/components/GameLayout.tsx` |
| Grade de edifícios | `game/building/components/BuildingGrid.tsx` |
| Modal de edifício | `game/building/components/BuildingModal.tsx` |
| Slider de ouro do castelo | `game/building/components/CastleGoldSlider.tsx` |
| Info de velocidade da prefeitura | `game/building/components/PrefeituraSpeedInfo.tsx` |
| Roteador de extras no modal | `game/building/components/BuildingExtra.tsx` |
| HUD de recursos | `game/resource/components/ResourceHUD.tsx` |
| Controles de velocidade | `game/resource/components/GameSpeedControls.tsx` |
| Fila de construção | `game/construction/components/ConstructionQueue.tsx` |
| Stats do império | `game/empire/components/EmpireStats.tsx` |
| Eventos recentes | `game/empire/components/RecentEvents.tsx` |
| Navegação | `game/navigation/components/GameSidebar.tsx` |
| Ícones de edifícios | `game/components/icons/*.tsx` |
| Ícones de recursos | `game/components/ResourceIcon.tsx` |
| Utilitários CSS | `lib/utils.ts` |
