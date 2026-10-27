# CLAUDE.md — Galadur

Decisões técnicas e convenções deste projeto. Leia antes de contribuir.

---

## 1. Stack & Ferramentas

| Ferramenta       | Versão mínima | Função                                           |
| ---------------- | ------------- | ------------------------------------------------ |
| Next.js          | 16            | App Router, export estático (`output: 'export'`) |
| React            | 19            | UI                                               |
| TypeScript       | 5             | Tipagem estática                                 |
| Tailwind CSS     | 4             | Estilização                                      |
| mwds (`@marcio`) | 0.16          | Design system: tokens, componentes, ícones, lint |
| Jotai            | 2             | Estado global                                    |
| ESLint           | 9             | Linting (Next + modo estrito do mwds)            |
| Prettier         | 3             | Formatação                                       |
| Node             | 26            | Versão fixada no `.nvmrc`                        |

---

## 2. Estrutura de Pastas

```
src/
├── app/
│   ├── layout.tsx          # Fontes, ThemeScript, TooltipProvider, Toaster
│   ├── page.tsx            # Única página: renderiza o jogo
│   ├── providers.tsx       # Providers globais (Jotai, game loop)
│   ├── globals.css         # Tokens do mwds (gerado)
│   └── mw-strict.css       # Modo estrito do mwds (gerado)
├── components/
│   ├── ui/                 # Componentes do mwds (gerados pelo registry)
│   └── icons/              # Ícones autorais do mwds (gerados pelo registry)
├── config/                 # Balanceamento: edifícios, unidades, inimigos
├── features/
│   ├── game-engine/        # Engine pura + hooks do loop
│   └── game/               # UI do jogo, dividida em sub-features
├── lib/
│   ├── format.ts           # Números, taxas e durações em pt-BR
│   └── utils.ts            # cn() (gerado)
└── store/                  # Átomos Jotai
```

Regra: nada de `features/X` importa de `features/Y`. Compartilhado vai em `components/` ou `lib/`.

### Código gerado pelo design system

Os arquivos instalados pelo registry do mwds (`src/components/ui/`, `src/components/icons/`, `src/app/globals.css`, `src/app/mw-strict.css`, `src/lib/utils.ts`, `eslint-rules/`, `eslint.mw.mjs`) **não seguem** o teto de 80 linhas, a proibição de comentários nem o Prettier (estão no `.prettierignore`). Não os edite à mão: atualize com `npx shadcn@latest add @marcio/<item> --diff` e depois `--overwrite`. Correção necessária num componente vai primeiro para o mwds.

Exceção atual: `src/components/ui/dialog.tsx` tem `*:shrink-0` no `DialogContent` para os filhos não encolherem quando o diálogo atinge a altura máxima. A correção precisa ir para o mwds; até lá, um `--overwrite` do `dialog` a desfaz.

Todo `add` reescreve o bloco de fontes de `src/app/layout.tsx`; rode `npm run format` depois.

---

## 3. Convenções de Componentes

Sempre componentes funcionais. Sem class components.

```tsx
interface UserCardProps {
  name: string;
  avatarUrl?: string;
}

export function UserCard({ name, avatarUrl }: UserCardProps) {
  return <div className="flex items-center gap-2">...</div>;
}
```

- Props tipadas com `interface`, nunca inline ou `any`.
- Nome do arquivo = nome do componente (PascalCase).
- Um componente por arquivo.

---

## 4. Estado Global (Jotai)

**Use Jotai** para estado compartilhado entre features ou que precisa persistir entre rotas.
**Use `useState`** para estado local de UI (aberto/fechado, input controlado).

```ts
// features/auth/store/authAtoms.ts
import { atom } from 'jotai';
import { User } from '../types';

export const currentUserAtom = atom<User | null>(null);
export const isAuthenticatedAtom = atom((get) => get(currentUserAtom) !== null);
```

Nomenclatura: `<nomeCamelCase>Atom`. Atoms ficam em `features/<feature>/store/`.

---

## 5. Data Fetching

Fetch nativo via custom hook dentro de `features/<feature>/hooks/`.

```ts
export function useUsers() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/users')
      .then((r) => r.json())
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
```

- Sempre retornar `{ data, loading, error }`.
- Sem bibliotecas de cache (React Query, SWR) por enquanto.
- Lógica HTTP reutilizável vai em `lib/http.ts`.

---

## 6. Roteamento

Next.js App Router com export estático. O jogo é uma página só (`src/app/page.tsx`), carregada apenas no cliente por `features/game/GameClient.tsx` (`next/dynamic` com `ssr: false`), porque o save é lido do `localStorage` durante a renderização.

- A troca entre cidade e exército é feita pelo `activePageAtom`, não por rotas.
- Alias `@/` mapeado para `src/` no `tsconfig`.
- O `basePath` `/the-galadur` vale só no build de produção (GitHub Pages); dev e Playwright rodam na raiz.
- Deploy: o workflow `.github/workflows/pages.yml` publica `out/` no GitHub Pages a cada push no `main` (ou manualmente pela aba Actions). Não há deploy manual.

---

## 7. Estilização

A identidade é a do design system [mwds](https://wenderu00.github.io/mwds/), à risca. Não há tema próprio do jogo.

- **Componentes do mwds primeiro**: `npx shadcn@latest add @marcio/<componente>`. Só escreva markup próprio quando o DS não tiver o componente.
- **Só tokens**: `bg-ground`, `text-ink`, `border-line`, `text-danger-text`, `category-N`... O modo estrito zera a paleta padrão do Tailwind, então `bg-red-500` ou `rounded-md` não geram CSS e o lint reprova.
- **Ícones**: os do pacote `@marcio/icons-medieval` para o domínio e o lucide para o resto, em `size-4`, `size-5` ou `size-6`, com `aria-hidden` quando são decorativos. Ícone em destaque vai num `IconTile`.
- **Cor de categoria nunca é a única pista**: sempre acompanhe com texto.
- **Movimento**: sempre com `motion-safe:`. `animate-mw-flash` só em evento discreto (compra, saque), nunca no tick de produção; ação negada usa `animate-mw-glitch`.
- **Escrita**: siga o guia [Escrita](https://wenderu00.github.io/mwds/escrita/): pt-BR, sem travessão, sem exclamação, números com `Intl` pt-BR (`src/lib/format.ts`), nomes de recurso traduzidos (`resourceNames.ts`).
- Não crie CSS customizado. Evite `style={{}}` inline.

---

## 8. TypeScript

- Proibido `any`. Use `unknown` e faça narrowing.
- `interface` para props de componentes e objetos de domínio.
- `type` para unions, utilitários e aliases.

```ts
// types.ts
export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export type UserRole = 'admin' | 'member' | 'guest';
export type ApiResponse<T> = { data: T; error: null } | { data: null; error: string };
```

Ative `strict: true` no `tsconfig.json`. Nunca desative regras de strictness.

---

## 9. Comentários

Proibido usar comentários no código — nem `//`, nem `/* */`, nem JSDoc `/** */`.

O código deve ser autoexplicativo: nomes de variáveis, funções e tipos descrevem a intenção. Se um trecho parece precisar de comentário, refatore-o para ficar claro sem explicação.

---

## 10. Linting

```bash
npm run lint          # ESLint em todo o projeto (inclui o modo estrito do mwds)
npm run typecheck     # TypeScript sem emitir arquivos
npm run format        # Prettier (escreve)
npm run format:check  # Prettier (só verifica — usado no CI)
```

Regras críticas ativas no ESLint:

- `@typescript-eslint/no-explicit-any` — **error**
- `react-hooks/rules-of-hooks` — **error**
- `react-hooks/exhaustive-deps` — **warn**
- `no-console` — **warn** (remova antes de merge)
- `import/no-cycle` — **error** (previne imports circulares entre features)
- `mw/no-raw-color`, `mw/no-raw-token`, `mw/icon-size` — **error** (cores, forma, movimento, camadas e tamanho de ícone só por token)

O CI falha se `lint` ou `format:check` retornar erro. Passar no lint estrito é o critério de migração para o mwds concluída.

## 11. Modularização de Features Complexas

Quando uma feature cresce além de **5 arquivos** ou qualquer arquivo ultrapassa **80 linhas**, ela deve ser decomposta em sub-features. Sub-features vivem dentro da própria feature, nunca no nível raiz de `features/`.

```
features/
└── game/
    ├── board/
    │   ├── components/
    │   │   ├── GameBoard.tsx
    │   │   └── BoardCell.tsx
    │   ├── hooks/
    │   │   └── useBoardState.ts
    │   └── types.ts
    ├── player/
    │   ├── components/
    │   │   ├── PlayerHand.tsx
    │   │   └── PlayerAvatar.tsx
    │   ├── hooks/
    │   │   └── usePlayerActions.ts
    │   └── types.ts
    ├── round/
    │   ├── components/
    │   │   └── RoundTimer.tsx
    │   ├── hooks/
    │   │   └── useRoundFlow.ts
    │   └── types.ts
    └── GamePage.tsx        ← único ponto de entrada da feature
```

Regra: `GamePage.tsx` orquestra as sub-features. Sub-features não se importam entre si — compartilhado sobe para `game/` ou `lib/`.

---

### Limite de linhas por arquivo

**80 linhas é o teto absoluto.** Não há exceção. Se um arquivo está chegando perto do limite, é sinal de que ele acumula mais de uma responsabilidade — divida antes de continuar.

Tipos de arquivo e o que fazer quando explodem:

| Tipo       | Arquivo cresceu? | Ação                                                     |
| ---------- | ---------------- | -------------------------------------------------------- |
| Componente | > 80 linhas      | Extraia sub-componentes nomeados                         |
| Hook       | > 80 linhas      | Separe em hooks menores com responsabilidade única       |
| `types.ts` | > 80 linhas      | Mova tipos por domínio para a sub-feature correspondente |

---

### Semântica de componentes

Todo componente deve satisfazer **as três condições** abaixo. Se falhar em qualquer uma, ele não está pronto.

**1 — Nome descreve o domínio, não a estrutura visual**

```tsx
// Errado — descreve estrutura
<div className="flex flex-col gap-4">
  <span className="text-lg font-bold">{player.name}</span>
</div>

// Certo — descreve o domínio
<PlayerHeader name={player.name} />
```

**2 — Tags HTML semânticas onde aplicável**

```tsx
// Errado
<div> ... </div>   // área de jogo
<div> ... </div>   // placar
<div> ... </div>   // lista de jogadores

// Certo
<main> ... </main>          // área de jogo
<aside> ... </aside>        // placar lateral
<ul> / <li> ... </ul>       // lista de jogadores
<section> ... </section>    // blocos temáticos sem semântica mais específica
<header> / <footer>         // cabeçalho e rodapé de cards ou da página
```

**3 — Responsabilidade única**

Um componente renderiza **uma coisa** do domínio. Se o nome precisar de "e" ou "com" para descrever o que faz (`CardWithScore`, `TimerAndControls`), ele deve ser dividido.

---

### Checklist antes de criar ou editar um componente

Antes de escrever qualquer componente novo ou modificar um existente, confirme mentalmente:

- [ ] O nome diz o que é no domínio do jogo, não como é estruturado visualmente?
- [ ] Ele faz exatamente uma coisa?
- [ ] As props estão tipadas com `interface`, sem `any`?
- [ ] O arquivo ficará dentro de 80 linhas após a mudança?
- [ ] Usei tags HTML semânticas onde havia opção melhor que `<div>` ou `<span>`?

Se qualquer item falhar, refatore antes de prosseguir.

---

## 12. Testes Automatizados (Playwright)

### Stack e estrutura

| Ferramenta   | Função                        |
| ------------ | ----------------------------- |
| Playwright   | Testes E2E de interface       |
| Page Objects | Abstração dos seletores da UI |

```
tests/
├── pages/     # Page Objects — um por área da UI
└── specs/     # Specs — um arquivo por feature
```

### Scripts

```bash
npm run test:e2e          # Executa todos os testes
npm run test:e2e:headed   # Executa com browser visível
npm run test:e2e:ui       # Abre a UI do Playwright
```

### Convenções

- Usar o MCP Playwright para inspecionar os elementos reais antes de escrever qualquer seletor.
- Nunca assumir seletores sem inspecionar — sempre capturar snapshot primeiro.
- Limpar o `localStorage` via `page.evaluate` e recarregar a página no `beforeEach` de cada spec que dependa de estado inicial.
- Page Objects ficam em `tests/pages/`, um arquivo por área da UI.
- Specs ficam em `tests/specs/`, um arquivo por feature.
- Cobrir sempre: caminho feliz + erro principal.

### Locators: hierarquia de uso

Prioridade decrescente ao escolher um locator:

1. **`getByTestId()`** — para elementos com identidade de domínio (qual recurso, qual edifício, qual unidade, qual botão de estado)
2. **`getByRole()`** — para elementos com semântica única no contexto (dialog, heading, button com nome único)
3. **`getByText()`** — para textos estáticos de domínio que nunca mudam por razões visuais
4. **Seletores CSS** — proibido para identificação; permitido apenas para estrutura interna de um componente já isolado por testid

Nunca usar classes Tailwind como identificadores de componente ou de estado.

### Convenção de `data-testid`

Formato: `[componente]-[elemento]` ou `[componente]-[elemento]-[identificador]`

| Padrão                         | Exemplo                           | Uso                                      |
| ------------------------------ | --------------------------------- | ---------------------------------------- |
| `game-hud`                     | —                                 | cabeçalho com dia, velocidade e recursos |
| `game-day-value`               | —                                 | número do dia de jogo                    |
| `resource-bar-{kind}`          | `resource-bar-wood`               | `Meter` do recurso (desktop)             |
| `resource-bar-{kind}-rate`     | `resource-bar-wood-rate`          | taxa de produção (+X/s)                  |
| `resource-bar-{kind}-compact`  | `resource-bar-wood-compact`       | `Meter` compacto (mobile)                |
| `speed-btn-pause`              | —                                 | item de pausa do `ToggleGroup`           |
| `speed-btn-{speed}x`           | `speed-btn-0.5x`                  | item de velocidade                       |
| `building-card-{id}`           | `building-card-castle`            | card de edifício                         |
| `building-card-{id}-level`     | `building-card-castle-level`      | texto de nível do edifício               |
| `building-modal-level`         | —                                 | nível no modal de edifício               |
| `unit-card-{id}`               | `unit-card-warrior`               | card de unidade militar                  |
| `unit-count-{id}`              | `unit-count-warrior`              | contador de unidades                     |
| `unit-train-{id}`              | `unit-train-warrior`              | botão de treinar unidade                 |
| `unit-training-time-{id}`      | `unit-training-time-warrior`      | tempo efetivo de treino da unidade       |
| `market-panel`                 | —                                 | painel de comércio                       |
| `market-buy-{kind}`            | `market-buy-wood`                 | botão de comprar recurso                 |
| `army-page`                    | —                                 | página do exército                       |
| `mobilization-unit-{id}-count` | `mobilization-unit-warrior-count` | campo de quantidade na mobilização       |
| `desktop-sidebar`              | —                                 | sidebar do `AppShell` (desktop)          |
| `summary-panel`                | —                                 | `AppShellAside` com o resumo             |

Elementos que vêm prontos do DS são buscados por papel e nome acessível, sem testid:

- valor do recurso: `getByRole('meter', { name: 'Madeira' })` e o atributo `aria-valuenow`;
- velocidade: `getByRole('radiogroup', { name: 'Velocidade do jogo' })` e itens `radio`;
- navegação: `getByRole('navigation', { name: 'Principal' })` com botões "cidade" e "exército" (no mobile, só a barra inferior fica visível);
- botões do `NumberInput`: `getByRole('button', { name: 'Aumentar guerreiros' })`;
- tema: `getByRole('radiogroup', { name: 'Tema' })`.

Tamanhos medidos logo após abrir um diálogo usam `offsetWidth`/`offsetHeight`, porque a animação de entrada do DS aplica `scale` e altera o `getBoundingClientRect`.

### Estado com `data-active`

Para elementos com estado ativo/inativo, usar `data-active` ao invés de verificar classes CSS:

```tsx
<ToggleGroupItem data-testid="speed-btn-pause" data-active={speed === 0} ...>
```

```typescript
const value = await page.getByTestId('speed-btn-pause').getAttribute('data-active');
return value === 'true';
```

### Missions

As missions de criação dos testes estão em `missions/`. Execute-as na ordem:

| Mission | Escopo                         |
| ------- | ------------------------------ |
| 01      | Configuração do Playwright     |
| 02      | Page Object: ResourceHUD       |
| 03      | Page Object: GameSpeedControls |
| 04      | Page Object: BuildingGrid      |
| 05      | Page Object: BuildingModal     |
| 06      | Page Object: SummaryPanel      |
| 07      | Fluxo completo de upgrade      |
