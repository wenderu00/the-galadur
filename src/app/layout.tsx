import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Bricolage_Grotesque, IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';
import { ThemeScript } from '@/components/ui/theme-toggle';
import { Toaster } from '@/components/ui/toast';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import './globals.css';

const bricolageGrotesqueBricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['500', '700', '800'],
  variable: '--font-bricolage',
});

const ibmPlexSansPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-sans',
});

const ibmPlexMonoPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
});

export const metadata: Metadata = {
  title: 'Galadur',
  description: 'Jogo incremental de estratégia medieval no navegador',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={cn(
        bricolageGrotesqueBricolage.variable,
        ibmPlexSansPlexSans.variable,
        ibmPlexMonoPlexMono.variable
      )}
    >
      <head>
        <ThemeScript />
      </head>
      <body>
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster />
      </body>
    </html>
  );
}
