"use client";

import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Slot } from "radix-ui";
import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useId,
  useState,
  useSyncExternalStore,
  type ComponentProps,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/ui/icon-button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const sidebarStorageKey = "mw-sidebar";
const sidebarEvent = "mw-sidebar-change";

function subscribeCollapsed(onChange: () => void) {
  window.addEventListener(sidebarEvent, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(sidebarEvent, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function readCollapsed() {
  try {
    return localStorage.getItem(sidebarStorageKey) === "collapsed";
  } catch {
    return false;
  }
}

function writeCollapsed(collapsed: boolean) {
  try {
    if (collapsed) localStorage.setItem(sidebarStorageKey, "collapsed");
    else localStorage.removeItem(sidebarStorageKey);
  } catch {}
  window.dispatchEvent(new Event(sidebarEvent));
}

const breakpointClasses = {
  md: { sidebar: "md:flex", menu: "md:hidden", toggle: "md:inline-flex", bottomNav: "md:hidden", body: "md:pb-0" },
  lg: { sidebar: "lg:flex", menu: "lg:hidden", toggle: "lg:inline-flex", bottomNav: "lg:hidden", body: "lg:pb-0" },
};

type AppShellContextValue = {
  mobileNav: "sheet" | "bottom";
  breakpoint: keyof typeof breakpointClasses;
  inBottomNav: boolean;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  sidebarId: string;
  inMobileSheet: boolean;
};

const AppShellContext = createContext<AppShellContextValue | null>(null);

export function useAppShell() {
  const context = useContext(AppShellContext);
  if (!context) throw new Error("useAppShell precisa estar dentro de <AppShell>");
  return context;
}

function countNavItems(node: ReactNode): number {
  return Children.toArray(node).reduce<number>((count, child) => {
    if (!isValidElement<{ children?: ReactNode }>(child)) return count;
    if (child.type === AppShellNavItem) return count + 1;
    return count + countNavItems(child.props.children);
  }, 0);
}

export type AppShellProps = ComponentProps<"div"> & {
  skipLinkLabel?: string;
  mainId?: string;
  mobileNav?: "sheet" | "bottom";
  sidebarBreakpoint?: keyof typeof breakpointClasses;
};

export function AppShell({
  skipLinkLabel = "Pular para o conteúdo",
  mainId = "conteudo",
  mobileNav = "sheet",
  sidebarBreakpoint = "lg",
  className,
  children,
  ...props
}: AppShellProps) {
  const collapsed = useSyncExternalStore(subscribeCollapsed, readCollapsed, () => false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const sidebarId = useId();

  let effectiveMobileNav = mobileNav;
  if (mobileNav === "bottom") {
    const items = countNavItems(children);
    if (items < 3 || items > 5) {
      effectiveMobileNav = "sheet";
      if (process.env.NODE_ENV !== "production") {
        console.warn(`AppShell: mobileNav="bottom" aceita de 3 a 5 itens e recebeu ${items}. A navegação volta para o painel lateral.`);
      }
    }
  }

  return (
    <AppShellContext.Provider
      value={{
        mobileNav: effectiveMobileNav,
        breakpoint: sidebarBreakpoint,
        inBottomNav: false,
        collapsed,
        setCollapsed: writeCollapsed,
        mobileOpen,
        setMobileOpen,
        sidebarId,
        inMobileSheet: false,
      }}
    >
      <TooltipProvider>
        <div
          data-slot="app-shell"
          data-collapsed={collapsed}
          className={cn("group/shell flex min-h-dvh bg-ground text-ink", className)}
          {...props}
        >
          <a
            href={`#${mainId}`}
            className="sr-only z-tooltip bg-accent px-4 py-3 font-semibold text-on-accent focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
          >
            {skipLinkLabel}
          </a>
          {children}
        </div>
      </TooltipProvider>
    </AppShellContext.Provider>
  );
}

export type AppShellSidebarProps = Omit<ComponentProps<"aside">, "children"> & {
  brand?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  mobileTitle?: string;
};

export function AppShellSidebar({ brand, footer, mobileTitle = "Menu", className, children, ...props }: AppShellSidebarProps) {
  const shell = useAppShell();
  const content = (inMobileSheet: boolean) => (
    <AppShellContext.Provider value={{ ...shell, collapsed: inMobileSheet ? false : shell.collapsed, inMobileSheet }}>
      {brand && <div className="flex h-16 shrink-0 items-center px-4">{brand}</div>}
      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-3 py-4">{children}</div>
      {footer && <div className="border-t border-line p-3">{footer}</div>}
    </AppShellContext.Provider>
  );

  return (
    <>
      <aside
        id={shell.sidebarId}
        data-slot="app-shell-sidebar"
        className={cn(
          "sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-line bg-band transition-[width] duration-base ease-standard motion-reduce:transition-none",
          breakpointClasses[shell.breakpoint].sidebar,
          shell.collapsed ? "w-16" : "w-64",
          className,
        )}
        {...props}
      >
        {content(false)}
      </aside>
      {shell.mobileNav === "bottom" ? (
        <div
          data-slot="app-shell-bottom-nav"
          className={cn(
            "fixed inset-x-0 bottom-0 z-sticky border-t border-line bg-band pb-[env(safe-area-inset-bottom)]",
            breakpointClasses[shell.breakpoint].bottomNav,
          )}
        >
          <AppShellContext.Provider value={{ ...shell, collapsed: false, inBottomNav: true }}>
            {Children.toArray(children).filter((child) => isValidElement(child) && child.type === AppShellNav)}
          </AppShellContext.Provider>
        </div>
      ) : (
        <Sheet open={shell.mobileOpen} onOpenChange={shell.setMobileOpen}>
          <SheetContent side="left" className="w-72 gap-0 bg-band p-0" closeLabel="Fechar menu" aria-describedby={undefined}>
            <SheetTitle className="sr-only">{mobileTitle}</SheetTitle>
            {content(true)}
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}

export function AppShellNav({ "aria-label": ariaLabel = "Principal", className, ...props }: ComponentProps<"nav">) {
  const { inBottomNav } = useAppShell();
  return (
    <nav
      data-slot="app-shell-nav"
      aria-label={ariaLabel}
      className={cn(inBottomNav ? "flex h-16 items-stretch" : "flex flex-col gap-6", className)}
      {...props}
    />
  );
}

export type AppShellNavGroupProps = ComponentProps<"div"> & {
  label?: ReactNode;
};

export function AppShellNavGroup({ label, className, children, ...props }: AppShellNavGroupProps) {
  const { collapsed, inBottomNav } = useAppShell();
  const labelId = useId();
  return (
    <div data-slot="app-shell-nav-group" className={cn(inBottomNav ? "contents" : "flex flex-col gap-1", className)} {...props}>
      {label && (
        <p
          id={labelId}
          className={cn("px-3 pb-1 font-mono text-mono-xs tracking-kicker text-ink-muted uppercase", (collapsed || inBottomNav) && "sr-only")}
        >
          {label}
        </p>
      )}
      <ul aria-labelledby={label ? labelId : undefined} className={inBottomNav ? "contents" : "flex flex-col gap-1"}>
        {children}
      </ul>
    </div>
  );
}

export type AppShellNavItemProps = Omit<ComponentProps<"a">, "children"> & {
  icon?: ReactNode;
  label: string;
  active?: boolean;
  badge?: ReactNode;
  asChild?: boolean;
  children?: ReactNode;
};

export function AppShellNavItem({ icon, label, active = false, badge, asChild = false, className, children, ...props }: AppShellNavItemProps) {
  const { collapsed, inMobileSheet, inBottomNav, setMobileOpen } = useAppShell();
  const Comp = asChild ? Slot.Root : "a";
  const link = (
    <Comp
      data-slot="app-shell-nav-item"
      data-active={active || undefined}
      aria-current={active ? "page" : undefined}
      onClick={() => {
        if (inMobileSheet) setMobileOpen(false);
      }}
      className={cn(
        inBottomNav
          ? "relative flex h-full min-h-control flex-col items-center justify-center gap-1 px-1 font-mono text-mono-xs text-ink-soft no-underline transition-colors duration-base hover:bg-surface hover:text-ink [&_svg]:size-5 [&_svg]:shrink-0"
          : "relative flex h-control items-center gap-3 rounded-control px-3 text-sm font-medium text-ink-soft no-underline transition-colors duration-base hover:bg-surface hover:text-ink [&_svg]:size-5 [&_svg]:shrink-0",
        active &&
          (inBottomNav
            ? "bg-accent-soft text-ink before:absolute before:inset-x-3 before:top-0 before:h-0.5 before:rounded-full before:bg-accent-line hover:bg-accent-soft"
            : "bg-accent-soft text-ink before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:rounded-full before:bg-accent-line hover:bg-accent-soft"),
        collapsed && "justify-center px-0",
        className,
      )}
      {...props}
    >
      <Slot.Slottable>{asChild ? children : null}</Slot.Slottable>
      {icon && (
        <span aria-hidden="true" className="inline-flex">
          {icon}
        </span>
      )}
      <span className={cn("truncate", collapsed && "sr-only", inBottomNav && "max-w-full")}>{label}</span>
      {badge && !collapsed && !inBottomNav && <span className="ml-auto">{badge}</span>}
    </Comp>
  );

  return (
    <li className={inBottomNav ? "flex-1" : undefined}>
      {collapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>{link}</TooltipTrigger>
          <TooltipContent side="right">{label}</TooltipContent>
        </Tooltip>
      ) : (
        link
      )}
    </li>
  );
}

export type AppShellHeaderProps = ComponentProps<"header"> & {
  menuLabel?: string;
  collapseLabel?: string;
  expandLabel?: string;
};

export function AppShellHeader({
  menuLabel = "Abrir menu",
  collapseLabel = "Recolher menu",
  expandLabel = "Expandir menu",
  className,
  children,
  ...props
}: AppShellHeaderProps) {
  const { collapsed, setCollapsed, setMobileOpen, sidebarId, mobileNav, breakpoint } = useAppShell();
  return (
    <header
      data-slot="app-shell-header"
      className={cn("sticky top-0 z-sticky col-span-full flex min-h-16 shrink-0 items-center gap-3 border-b border-line bg-ground px-4", className)}
      {...props}
    >
      {mobileNav === "sheet" && (
        <IconButton aria-label={menuLabel} size="sm" onClick={() => setMobileOpen(true)} className={cn("[&_svg]:size-5", breakpointClasses[breakpoint].menu)}>
          <Menu aria-hidden="true" />
        </IconButton>
      )}
      <IconButton
        aria-label={collapsed ? expandLabel : collapseLabel}
        aria-controls={sidebarId}
        aria-expanded={!collapsed}
        size="sm"
        onClick={() => setCollapsed(!collapsed)}
        className={cn("hidden [&_svg]:size-5", breakpointClasses[breakpoint].toggle)}
      >
        {collapsed ? <PanelLeftOpen aria-hidden="true" /> : <PanelLeftClose aria-hidden="true" />}
      </IconButton>
      {children}
    </header>
  );
}

export function AppShellBody({ className, ...props }: ComponentProps<"div">) {
  const { mobileNav, breakpoint } = useAppShell();
  return (
    <div
      data-slot="app-shell-body"
      className={cn(
        "flex min-w-0 flex-1 flex-col",
        "lg:has-[>[data-slot=app-shell-aside]]:grid lg:has-[>[data-slot=app-shell-aside]]:grid-cols-[minmax(0,1fr)_auto] lg:has-[>[data-slot=app-shell-aside]]:grid-rows-[auto_1fr]",
        mobileNav === "bottom" && ["pb-[calc(4rem+env(safe-area-inset-bottom))]", breakpointClasses[breakpoint].body],
        className,
      )}
      {...props}
    />
  );
}

export type AppShellAsideProps = ComponentProps<"aside"> & {
  "aria-label": string;
};

export function AppShellAside({ className, ...props }: AppShellAsideProps) {
  return (
    <aside
      data-slot="app-shell-aside"
      className={cn("border-t border-line px-4 py-8 md:px-8 lg:w-80 lg:border-t-0 lg:border-l lg:px-6", className)}
      {...props}
    />
  );
}

export type AppShellMainProps = ComponentProps<"main"> & {
  /** div quando o AppShell está dentro de uma página que já tem o próprio main. */
  as?: "main" | "div";
};

export function AppShellMain({ id = "conteudo", as = "main", className, ...props }: AppShellMainProps) {
  const Comp = as as "main";
  return <Comp data-slot="app-shell-main" id={id} tabIndex={-1} className={cn("flex-1 px-4 py-8 outline-none md:px-8", className)} {...props} />;
}
