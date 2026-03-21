/**
 * App.tsx — Componente raiz da aplicação.
 *
 * Por ora, apenas envolve os Providers.
 * Rotas e UI serão adicionadas nas próximas entregas.
 */

import { Providers } from '@/app/providers';

export function App() {
  return (
    <Providers>
      {/* UI e rotas serão renderizadas aqui */}
    </Providers>
  );
}
