const QuickActions = ({ actions = [], onSelect, className = "" }) => {
  if (!actions.length) return null;

  return (
    <div className={`aura-scrollbar flex gap-2 overflow-x-auto pb-1 ${className}`}>
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          onClick={() => onSelect?.(action)}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-semibold text-slate-200 transition hover:-translate-y-0.5 hover:border-cyan-300/45 hover:bg-cyan-300/10 hover:text-white focus-visible:outline-cyan-300"
        >
          <action.icon size={14} className="text-cyan-200" />
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;

