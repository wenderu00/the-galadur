# CLAUDE.md — Galadur

Decisões técnicas e convenções deste projeto. Leia antes de contribuir.

---

## 1. Stack & Ferramentas

| Ferramenta   | Versão mínima | Função             |
| ------------ | ------------- | ------------------ |
| React        | 18            | UI                 |
| Vite         | 5             | Build / dev server |
| TypeScript   | 5             | Tipagem estática   |
| Tailwind CSS | 3             | Estilização        |
| shadcn/ui    | —             | Componentes base   |
| Jotai        | 2             | Estado global      |
| Wouter       | 3             | Roteamento         |
| ESLint       | 9             | Linting            |
| Prettier     | 3             | Formatação         |

---

## 2. Estrutura de Pastas

```
src/
├── app/
│   ├── routes.tsx          # Declaração central de rotas
│   └── providers.tsx       # Providers globais (Jotai, tema, etc.)
├── components/             # Componentes verdadeiramente reutilizáveis
│   └── ui/                 # Componentes shadcn gerados
├── features/
│   ├── auth/
│   │   ├── components/     # LoginForm, AuthGuard...
│   │   ├── hooks/          # useLogin, useSession...
│   │   ├── store/          # atoms de auth
│   │   └── types.ts
│   └── dashboard/
│       ├── components/
│       ├── hooks/
│       └── types.ts
├── lib/
│   └── http.ts             # Wrapper fino sobre fetch
└── main.tsx
```

Regra: nada de `features/X` importa de `features/Y`. Compartilhado vai em `components/` ou `lib/`.

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

Wouter. Todas as rotas declaradas em `src/app/routes.tsx`.

```tsx
import { Route, Switch } from 'wouter';
import { LoginPage } from '@/features/auth/components/LoginPage';
import { DashboardPage } from '@/features/dashboard/components/DashboardPage';

export function Routes() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/dashboard" component={DashboardPage} />
    </Switch>
  );
}
```

- Alias `@/` mapeado para `src/` no `tsconfig` e `vite.config`.
- Páginas ficam em `features/<feature>/components/<Nome>Page.tsx`.

---

## 7. Estilização

- **Tailwind primeiro**: estilize diretamente com classes utilitárias.
- **shadcn/ui** para componentes interativos complexos (Dialog, Select, Toast...). Gere com `npx shadcn@latest add <componente>`.
- Não crie CSS customizado sem necessidade. Evite `style={{}}` inline.

```tsx
// Bom
<button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white">
  Salvar
</button>

// Evitar — crie um componente shadcn se precisar de variantes
<button style={{ backgroundColor: '#6366f1', padding: '8px 16px' }}>
  Salvar
</button>
```

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
npm run lint       # ESLint em todo o projeto
npm run format     # Prettier (escreve)
npm run format:check  # Prettier (só verifica — usado no CI)
```

Regras críticas ativas no ESLint:

- `@typescript-eslint/no-explicit-any` — **error**
- `react-hooks/rules-of-hooks` — **error**
- `react-hooks/exhaustive-deps` — **warn**
- `no-console` — **warn** (remova antes de merge)
- `import/no-cycle` — **error** (previne imports circulares entre features)

O CI falha se `lint` ou `format:check` retornar erro.

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

| Ferramenta      | Função                        |
| --------------- | ----------------------------- |
| Playwright      | Testes E2E de interface       |
| Page Objects    | Abstração dos seletores da UI |

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

### Missions

As missions de criação dos testes estão em `missions/`. Execute-as na ordem:

| Mission | Escopo                             |
| ------- | ---------------------------------- |
| 01      | Configuração do Playwright         |
| 02      | Page Object: ResourceHUD           |
| 03      | Page Object: GameSpeedControls     |
| 04      | Page Object: BuildingGrid          |
| 05      | Page Object: BuildingModal         |
| 06      | Page Object: SummaryPanel          |
| 07      | Fluxo completo de upgrade          |
