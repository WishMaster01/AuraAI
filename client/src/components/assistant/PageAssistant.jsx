import { Sparkles, ChevronRight } from "lucide-react";

const defaultActions = [
  "Summarize page",
  "Explain text",
  "Rewrite",
  "Translate",
];

const PageAssistant = ({
  title = "Command center",
  subtitle = "Compact browser workflows for chat and page actions.",
  actions = defaultActions,
  onAction,
  status = "Ready",
}) => {
  return (
    <section className="aura-glass aura-border rounded-lg p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200">
            Page assistant
          </p>
          <h3 className="aura-heading mt-1 truncate text-base font-bold text-white">
            {title}
          </h3>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-300/20 bg-teal-300/10 px-2.5 py-1 text-[11px] font-semibold text-teal-100">
          <Sparkles size={12} />
          {status}
        </span>
      </div>

      <p className="mt-2 text-sm leading-6 text-slate-400">{subtitle}</p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {actions.map((action) => (
          <button
            key={action}
            type="button"
            onClick={() => onAction?.(action)}
            className="flex min-h-11 items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-left text-sm font-medium text-slate-200 transition hover:-translate-y-0.5 hover:border-cyan-300/45 hover:bg-white/[0.08]"
          >
            <span className="truncate">{action}</span>
            <ChevronRight size={14} className="shrink-0 text-cyan-200/80" />
          </button>
        ))}
      </div>
    </section>
  );
};

export default PageAssistant;
