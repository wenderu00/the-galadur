export function GameTip() {
  return (
    <section className="p-4">
      <div className="flex items-start gap-2">
        <span className="text-yellow-400 text-base leading-none mt-0.5">💡</span>
        <div className="flex flex-col gap-1">
          <h2 className="text-xs font-medieval uppercase tracking-widest text-realm-400">
            Dica
          </h2>
          <p className="text-xs text-realm-500 leading-relaxed">
            Faça upgrade do Castelo para aumentar o armazenamento e desbloquear novas construções.
          </p>
        </div>
      </div>
    </section>
  );
}
