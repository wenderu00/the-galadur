import { useId, type ReactNode } from 'react';

interface PanelSectionProps {
  title: string;
  headingLevel?: 'h2' | 'h3';
  children: ReactNode;
}

export function PanelSection({ title, headingLevel = 'h2', children }: PanelSectionProps) {
  const headingId = useId();
  const Heading = headingLevel;

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-3">
      <Heading id={headingId} className="font-display text-lg font-bold text-ink">
        {title}
      </Heading>
      {children}
    </section>
  );
}
