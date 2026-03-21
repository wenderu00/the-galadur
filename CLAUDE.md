# CLAUDE.md — Galadur

Decisões técnicas e convenções deste projeto. Leia antes de contribuir.

---

## 1. Stack & Ferramentas

| Ferramenta     | Versão mínima | Função                    |
|----------------|---------------|---------------------------|
| React          | 18            | UI                        |
| Vite           | 5             | Build / dev server        |
| TypeScript     | 5             | Tipagem estática          |
| Tailwind CSS   | 3             | Estilização               |
| shadcn/ui      | —             | Componentes base          |
| Jotai          | 2             | Estado global             |
| Wouter         | 3             | Roteamento                |
| ESLint         | 9             | Linting                   |
| Prettier       | 3             | Formatação                |

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
