# Lacunas do mwds para a migração do Galadur

Levantamento do que o design system [`wenderu00/mwds`](https://github.com/wenderu00/mwds) (v0.15.0) ainda não oferece para o Galadur seguir o DS à risca. A migração só começa depois que o DS cobrir as lacunas bloqueantes.

Contexto do Galadur hoje: Vite 5, React 18, Tailwind 3, `@base-ui/react`, `framer-motion`, paleta própria (`realm-*`, `gold-*`), fonte Cinzel e só tema escuro. O DS exige Tailwind v4, `radix-ui` e, na prática, React 19 (os componentes recebem `ref` como prop).

## Lacunas que bloqueiam a migração

| #   | Necessidade do jogo                                                                                                                 | Onde no Galadur                                                                        | O que o DS tem                                                                                                                                                          | O que falta no DS                                                                                                                                                                                                                                 |
| --- | ----------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Instalação em projeto **Vite** (não Next)                                                                                           | todo o projeto                                                                         | `init marcio-tokens` grava `components.json` com `rsc: true` e `css: app/globals.css`; fontes só via `next/font` (`font-bricolage`, `font-plex-sans`, `font-plex-mono`) | Caminho oficial para Vite: itens de fonte sem `next/font` (por exemplo `@fontsource` ou `@font-face`), `init` que respeite `src/index.css` e `ThemeScript` documentado para `index.html`                                                          |
| 2   | Aplicar o DS à risca no projeto consumidor                                                                                          | lint e CI                                                                              | As regras `mw/no-raw-color`, `mw/no-raw-token`, `mw/icon-size` e os resets (`--color-*: initial`, `--radius-*`, `--shadow-*`) existem só no repo do DS                  | Item de registry com `eslint-rules/*` e o bloco de config, e item opcional com os resets. Corrigir a contradição: "Primeiros passos" diz que o `init` aplica os resets, mas o `build-registry.ts` os remove                                       |
| 3   | **Navegação inferior mobile**: 3 abas com ícone e rótulo, ativa e inativa                                                           | `MobileBottomNav`, `MobileNavTab`                                                      | Nada. O `AppShell` vira um Sheet à esquerda e o `Navbar` um Sheet à direita                                                                                             | Componente `BottomNav`: fixo, 3 a 5 itens, `aria-current`, área de toque `h-control`                                                                                                                                                              |
| 4   | **Layout de 3 colunas** (sidebar, conteúdo e painel de resumo à direita) com breakpoint `md`                                        | `GameLayout`, `GameSummaryPanel`, `MobileContentArea`                                  | `AppShell` só tem sidebar à esquerda e só aparece a partir de `lg`; `AppShellHeader` tem altura fixa `h-16`                                                             | Painel secundário à direita (`AppShellAside`), breakpoint configurável (`md` ou `lg`) e header com altura livre (o HUD tem 2 linhas no mobile)                                                                                                    |
| 5   | **Medidor compacto de recurso**: ícone, valor, máximo, taxa `+N/s` e barra fina; variante cheia e compacta (4 lado a lado em 390px) | `ResourceBar`, `ResourceBarCompact`                                                    | `StatCard` (beta): Card com `p-5`, valor em `display-md`, sem lugar para ícone e sem variante compacta                                                                  | `StatCard size="sm"` ou um novo `Meter` (ou `ResourceStat`) com ícone e modo compacto                                                                                                                                                             |
| 6   | **Cores por categoria fora de gráfico** (madeira, pedra, comida, ouro)                                                              | `resourceConfig.ts`, `ResourceIcon`, barras de recurso                                 | `chart-1` a `chart-8`, mas a regra diz que são só para gráficos e nunca para texto                                                                                      | Tokens categóricos para UI (`category-N` com `-soft`, `-line` e `-text` validados em contraste), ou regra explícita liberando `chart-N` em barras e fundos de ícone                                                                               |
| 7   | **Animações de feedback**: destaque único quando um valor muda; tremor quando a ação é negada                                       | `ResourceBar` (pulso), `BuildingUpgradePrompt` (tremor)                                | Só entradas (`fade-in`, `pop-in`, `slide-in`) e loops (`pulse` do skeleton, `glitch`, `blink`)                                                                          | `animate-mw-flash` e `animate-mw-shake`, rodando uma vez e atrás de `motion-safe:`                                                                                                                                                                |
| 8   | **Ícones de domínio**                                                                                                               | 7 edifícios, 4 recursos e 3 unidades em SVG próprio; ícone de 48px no card de edifício | Só `lucide-react`, em `size-4`, `size-5` ou `size-6`                                                                                                                    | Regra para ícones fora do lucide (o lucide não tem lanceiro; arqueiro só com `BowArrow`) e um tamanho maior que `size-6` para destaque (por exemplo um `IconTile` com `size-10` e `size-12`), ou a confirmação de que tudo fica em lucide de 24px |

## Lacunas menores

Dá para contornar, mas vale decidir no DS.

| #   | Ponto                                                          | Detalhe                                                                                                                                                      |
| --- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 9   | `Progress` com texto de tempo                                  | Hoje mostra só a porcentagem (`showValue`). O jogo mostra "12s restantes". Pedido: `formatValue` ou `valueText`                                              |
| 10  | `NumberInput` (beta)                                           | Confirmar se os botões de diminuir e aumentar aceitam rótulo e props como `data-testid`. A mobilização usa `mobilization-unit-{id}-increment` e `-decrement` |
| 11  | `Card interactive` clicável inteiro                            | O card de edifício abre o modal ao clicar. Confirmar se `Card` aceita `asChild` (para `<article>` ou `<button>`) ou como tornar o card todo clicável         |
| 12  | `mw/no-raw-token` não cobre `text-[11px]`, `w-[..]` e `h-[..]` | O próprio DS usa `text-[11px]`. Decidir se é permitido ou se vira token                                                                                      |

## Coberto pelo DS

Estes itens não são lacunas:

| Necessidade do jogo                       | Item do DS                       |
| ----------------------------------------- | -------------------------------- |
| Botões                                    | `Button`, `IconButton`           |
| Controle de velocidade (pausa, 0.5x a 4x) | `ToggleGroup`                    |
| Modal de edifício, mobilização e batalha  | `Dialog`                         |
| Slider de ouro do castelo                 | `Slider` com `FormField`         |
| Quantidade no mercado e na mobilização    | `NumberInput`                    |
| Etiquetas "em breve", "derrotado" e ×N    | `Badge`                          |
| Status do império (`dt` e `dd`)           | `DescriptionList`                |
| Dica                                      | `Alert tone="info"`              |
| Estados vazios                            | `EmptyState`                     |
| Título de página                          | `PageHeader`                     |
| Rótulos em caixa-alta                     | `Kicker`                         |
| Tempo de construção e de treino           | `Progress`                       |
| Sidebar no desktop                        | `AppShellNav`, `AppShellNavItem` |
| Transição de página                       | `animate-mw-fade-in`             |
| Custo insuficiente                        | `text-danger-text`               |
| Tema claro e escuro                       | `ThemeToggle`, `ThemeScript`     |

## Regras de escrita do DS que o jogo viola hoje

Isso é trabalho do Galadur, não do DS:

- Travessão em "Próximo nível — custo" e no valor vazio "—".
- Textos em inglês: "Build Your Empire", "SOON" e o "Close" do Dialog.
- Chave crua de recurso no saque da batalha ("+50 wood").
- Emoji como ícone (🪙 no mercado, 💡 na dica).
- "Vitória!" com exclamação.
- Números com `toLocaleString()` sem `pt-BR`.

## Perguntas em aberto

1. Lacuna 8: o jogo pode usar ícones próprios fora do lucide, ou tudo vira lucide de 24px?
2. Lacuna 6: tokens `category-N` novos ou liberar `chart-N` na UI?
3. Identidade visual: seguir o DS à risca apaga a identidade "dark fantasy" (violeta, dourado, Cinzel, cantos retos). O jogo medieval passa a ter cara de terminal preto e amarelo. É isso mesmo que se quer?
