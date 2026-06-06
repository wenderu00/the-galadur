# Identidade Visual — Galadur

Mapeamento completo do sistema visual do projeto. Use como referência ao criar ou modificar qualquer elemento visual.

---

## 1. Conceito

UI de jogo no estilo **dark fantasy medieval**. Os princípios visuais:

- Cantos angulares (sem arredondamento) — estética rígida e medieval
- Paleta **negro-púrpura** profunda — o "Tribunal Arcano": fundos quase negros com leve toque violeta
- **Violeta/Roxo** para ações primárias (botões, estados ativos, ícones) — evoca magia e poder
- **Dourado** exclusivamente para elementos econômicos (barras de progresso, moedas, timers)
- Cores por recurso para parsing visual imediato (inalteradas)
- Tipografia serifada medieval para autenticidade

---

## 2. Paleta de Cores

### Variáveis CSS (sistema shadcn/ui — OKLCH)

Definidas em `src/index.css`:

| Variável                 | Valor OKLCH                 | Uso                             |
| ------------------------ | --------------------------- | ------------------------------- |
| `--background`           | `oklch(0.08 0.04 285)`      | Fundo principal (negro-púrpura) |
| `--foreground`           | `oklch(1 0 0)`              | Texto primário (branco)         |
| `--card`                 | `oklch(0.07 0.045 285)`     | Fundo de cards                  |
| `--card-foreground`      | `oklch(1 0 0)`              | Texto em cards                  |
| `--popover`              | `oklch(0.07 0.045 285)`     | Fundo de popovers               |
| `--popover-foreground`   | `oklch(1 0 0)`              | Texto em popovers               |
| `--primary`              | `oklch(0.55 0.26 280)`      | Violeta — ações primárias       |
| `--primary-foreground`   | `oklch(1 0 0)`              | Texto sobre primary             |
| `--secondary`            | `oklch(0.14 0.06 280)`      | Púrpura escuro — secundário     |
| `--secondary-foreground` | `oklch(1 0 0)`              | Texto sobre secondary           |
| `--muted`                | `oklch(0.14 0.06 280)`      | Elementos discretos             |
| `--muted-foreground`     | `oklch(0.65 0.1 280)`       | Texto discreto                  |
| `--accent`               | `oklch(0.18 0.07 280)`      | Acento sutil                    |
| `--accent-foreground`    | `oklch(1 0 0)`              | Texto sobre accent              |
| `--destructive`          | `oklch(0.577 0.245 27.325)` | Vermelho-laranja — destrutivo   |
| `--border`               | `oklch(0.15 0.07 280)`      | Bordas                          |
| `--input`                | `oklch(0.15 0.07 280)`      | Campos de input                 |
| `--ring`                 | `oklch(0.55 0.26 280)`      | Anel de foco (violeta)          |
| `--sidebar`              | `oklch(0.06 0.045 285)`     | Fundo da sidebar                |
| `--sidebar-foreground`   | `oklch(1 0 0)`              | Texto da sidebar                |
| `--sidebar-border`       | `oklch(0.15 0.07 280)`      | Bordas da sidebar               |
| `--sidebar-ring`         | `oklch(0.55 0.26 280)`      | Foco da sidebar                 |

### Paleta `realm` (negro-púrpura do tribunal arcano)

Definida em `tailwind.config.ts`:

| Token       | Hex       | Uso típico                         |
| ----------- | --------- | ---------------------------------- |
| `realm-950` | `#08060f` | Fundo de sidebar, tracking badge   |
| `realm-900` | `#0f0b1e` | Fundo de cards e containers        |
| `realm-800` | `#1c1535` | Bordas e divisores                 |
| `realm-700` | `#2d1f5e` | Tom médio                          |
| `realm-600` | `#4a2d8a` | Tom mais claro                     |
| `realm-500` | `#6b48c4` | Texto de acento, nav inativa       |
| `realm-400` | `#9370db` | Texto secundário de alto contraste |

### Paleta `gold` (ouro — progressão)

| Token      | Hex       | Uso típico                          |
| ---------- | --------- | ----------------------------------- |
| `gold-300` | `#fde68a` | Ouro claro                          |
| `gold-400` | `#f5c842` | Destaque dourado                    |
| `gold-500` | `#d4a017` | Preenchimento de barra de progresso |
| `gold-600` | `#b8860b` | Ouro mais escuro                    |
| `gold-700` | `#8b6914` | Borda dourada                       |

### Cores por recurso

| Recurso | Fundo        | Texto / Ícone | Barra de progresso |
| ------- | ------------ | ------------- | ------------------ |
| Madeira | `green-950`  | `green-400`   | `green-500`        |
| Pedra   | `slate-900`  | `slate-400`   | `slate-500`        |
| Comida  | `amber-950`  | `amber-400`   | `amber-500`        |
| Ouro    | `yellow-950` | `yellow-400`  | `yellow-500`       |

### Cores funcionais

| Função                       | Cor Tailwind               |
| ---------------------------- | -------------------------- |
| Ação primária / ativo        | `violet-700`, `violet-600` |
| Ícones de construção/unidade | `violet-400`               |
| Taxa de produção             | `violet-400`               |
| Aviso (recurso insuficiente) | `red-400`                  |
| Bônus de armazenamento       | `amber-400`                |
| Overlay de modal             | `black/75`                 |

---

## 3. Tipografia

### Fontes

| Família             | Fonte          | Fallback       | Uso                           |
| ------------------- | -------------- | -------------- | ----------------------------- |
| `font-medieval`     | Cinzel (serif) | Georgia, serif | Títulos, labels, nome do jogo |
| (padrão do sistema) | —              | —              | Corpo, valores numéricos      |

Importação via Google Fonts: `family=Cinzel:wght@400;600;700`

### Pesos

| Peso | Classe Tailwind | Uso                                   |
| ---- | --------------- | ------------------------------------- |
| 400  | `font-normal`   | Texto de corpo                        |
| 600  | `font-semibold` | Nome de construções, valores de stats |
| 700  | `font-bold`     | Títulos principais                    |

### Tamanhos e estilos recorrentes

| Classe                                | Uso                                    |
| ------------------------------------- | -------------------------------------- |
| `text-2xl font-bold`                  | Títulos de página                      |
| `text-lg font-bold`                   | Contador de dia                        |
| `text-sm font-bold`                   | Nome de construções, labels de stats   |
| `text-xs`                             | Descrições e textos secundários        |
| `text-[11px]`                         | Texto terciário, labels pequenos       |
| `text-[10px]`                         | Labels minúsculos com estilo medieval  |
| `uppercase tracking-widest`           | Labels medievais em caixa-alta         |
| `font-mono` + `text-xs text-gold-400` | Tempo restante em barras de progresso  |
| `tabular-nums`                        | Valores numéricos alinhados (recursos) |

---

## 4. Bordas e Raios

- **Padrão do jogo**: `rounded-none` — cantos absolutamente retos
- **Componentes shadcn (botão)**: `rounded-lg`
- **Diálogos**: `rounded-xl`

Espessura: sempre `1px` (classe `border`).

---

## 5. Padrões de Espaçamento

### Padding

| Contexto                   | Classe                 |
| -------------------------- | ---------------------- |
| Cards e seções             | `p-3` ou `p-4`         |
| Header da sidebar          | `px-4 py-5`            |
| Botões                     | `py-2.5 px-4` / `px-3` |
| Cabeçalhos de conteúdo     | `px-6 py-3`            |
| Área de conteúdo principal | `px-6 py-4`            |

### Gap

- Entre componentes: `gap-2`, `gap-3`, `gap-4`
- Layouts flex usam `gap-*` consistentemente (sem margin manual)

---

## 6. Padrões de Componentes

### Cards e containers

```
bg-realm-900 border border-realm-800
hover:border-violet-700/60 transition-colors duration-200
p-3 a p-4
```

### Cards de construção

- Elemento semântico: `<article>`
- Caixa de ícone: `w-12 h-12 bg-violet-950 border-violet-800/50`
- Hover no ícone: `group-hover:border-violet-600/80 transition-colors`
- Cor do ícone: `text-violet-400`
- Botão de ação: largura total, `bg-violet-700` quando ativo
- Barra de progresso: dourada

### Botões

| Estado     | Classes                                          |
| ---------- | ------------------------------------------------ |
| Ativo      | `bg-violet-700 hover:bg-violet-600 text-white`   |
| Inativo    | `bg-realm-950 hover:bg-realm-950 text-realm-600` |
| Destrutivo | Variante `destructive` do shadcn                 |

Todos sem arredondamento (`rounded-none`).

### Barras de progresso

```
Trilha:     h-1.5 (ou h-0.5) rounded-none bg-realm-950 border border-gold-700
Indicador:  bg-gold-500 rounded-none transition-all duration-300
Label:      text-xs text-gold-400 mt-1 font-mono
```

### Itens de navegação

| Estado  | Classes                                                                               |
| ------- | ------------------------------------------------------------------------------------- |
| Ativo   | `bg-violet-600/20 border border-violet-600/40 text-violet-400`                        |
| Inativo | `text-realm-500 hover:text-realm-300 hover:bg-realm-800/50 border border-transparent` |
| Badge   | `text-realm-600 bg-realm-800 px-1.5 py-0.5`                                           |

### Barras de recurso

```
Container:  flex items-center gap-3 bg-realm-900 border (cor da borda por recurso)
Caixa ícone: w-8 h-8 (fundo e borda específicos do recurso)
Trilha:     h-0.5 bg-realm-800 com barra colorida por recurso
Texto:      tabular-nums para alinhamento
```

---

## 7. Opacidade e Transparência

| Sufixo | Uso                                 |
| ------ | ----------------------------------- |
| `/20`  | Lavagem de fundo leve (nav ativo)   |
| `/40`  | Ênfase em borda                     |
| `/60`  | Bordas sutis em cards de construção |
| `/75`  | Overlay de fundo de modal           |
| `/80`  | Ênfase visual mais forte            |

---

## 8. Temas

- **Apenas dark mode** — nenhuma configuração de light mode existe
- Sem `prefers-color-scheme` ou toggle de tema
- Todas as cores são otimizadas para fundo escuro
- Variáveis CSS na seleção `:root`
- Espaço de cor OKLCH para consistência perceptual

---

## 9. Branding

- **Nome**: Galadur
- **Logo**: ícone SVG de casa (`House` do Lucide) embutido inline no `GameSidebar`, fundo branco quadrado
- **Sem assets de marca externos** — sem arquivos PNG, SVG de logo, ou pasta `/assets/brand`
- Texto "Galadur" é o único elemento textual de marca

---

## 10. Arquivos-chave

| Arquivo                                                   | Conteúdo                                                        |
| --------------------------------------------------------- | --------------------------------------------------------------- |
| `src/index.css`                                           | Variáveis CSS globais (OKLCH), base styles                      |
| `tailwind.config.ts`                                      | Paletas `realm` e `gold`, `font-medieval`, `borderRadius: 0rem` |
| `components.json`                                         | Configuração shadcn/ui (`base-nova`, `neutral`)                 |
| `src/components/ui/button.tsx`                            | Variantes de botão                                              |
| `src/components/ui/progress.tsx`                          | Componente de barra de progresso                                |
| `src/components/ui/dialog.tsx`                            | Componente de diálogo                                           |
| `src/features/game/resource/components/resourceConfig.ts` | Mapeamento de cores por recurso                                 |
