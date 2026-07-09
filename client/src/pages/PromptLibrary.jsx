import { useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Check, ArrowRight } from "lucide-react";

const prompts = [
  { category: "Productivity", title: "Daily planner", text: "Create a focused daily plan with 3 priorities, time blocks, and a short evening review." },
  { category: "Writing", title: "Blog outline", text: "Generate a detailed blog outline with H2 sections and key talking points for:" },
  { category: "Dev", title: "Debug helper", text: "Analyze this error, list likely causes, and suggest fixes step by step:" },
  { category: "Business", title: "Pitch deck bullets", text: "Create 8 compelling pitch deck bullet points for a startup that:" },
  { category: "Learning", title: "Explain like I am 12", text: "Explain this concept in simple terms with one analogy and a quick quiz:" },
  { category: "Voice", title: "Voice command", text: "Hey Aura, open YouTube and search for productivity music." },
];

const PromptLibrary = () => {
  const [copied, setCopied] = useState(null);

  const handleCopy = async (text, id) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14 lg:px-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-semibold uppercase text-cyan-200">Prompt library</p>
          <h1 className="aura-heading mt-2 text-4xl font-black tracking-tight sm:text-5xl">Command-ready prompts.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            Copy prompts or send them straight into the assistant with context preserved.
          </p>
        </div>
        <Link to="/assistant" className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm font-bold text-slate-100 transition hover:border-cyan-300/45 hover:bg-white/[0.08]">
          Open Assistant <ArrowRight size={15} />
        </Link>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {prompts.map((item, idx) => (
          <article key={item.title} className="aura-card aura-border p-5">
            <span className="rounded-lg border border-cyan-300/20 bg-cyan-300/10 px-2.5 py-1 text-xs font-bold uppercase text-cyan-100">
              {item.category}
            </span>
            <h2 className="aura-heading mt-4 text-lg font-bold">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">{item.text}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleCopy(item.text, idx)}
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.04] px-3 py-2 text-xs font-bold text-slate-200 transition hover:bg-white/[0.08]"
              >
                {copied === idx ? <Check size={14} /> : <Copy size={14} />}
                {copied === idx ? "Copied" : "Copy"}
              </button>
              <Link
                to="/assistant"
                state={{ prefilledPrompt: item.text }}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-300 to-teal-300 px-3 py-2 text-xs font-bold text-slate-950 transition hover:brightness-110"
              >
                Use in chat <ArrowRight size={14} />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default PromptLibrary;
