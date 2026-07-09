import { Link } from "react-router-dom";
import {
  FileText,
  Code2,
  Mail,
  Calendar,
  Languages,
  Lightbulb,
  ArrowRight,
} from "lucide-react";

const tools = [
  {
    icon: FileText,
    title: "Summarize",
    desc: "Condense long pages into crisp takeaways.",
    prompt: "Summarize the following in 5 bullet points:",
  },
  {
    icon: Code2,
    title: "Code Explainer",
    desc: "Understand snippets and errors step by step.",
    prompt: "Explain this code step by step:",
  },
  {
    icon: Mail,
    title: "Email Draft",
    desc: "Draft polished replies and outreach.",
    prompt: "Write a professional email about:",
  },
  {
    icon: Calendar,
    title: "Meeting Notes",
    desc: "Turn calls into action items and decisions.",
    prompt: "Create meeting notes with action items from:",
  },
  {
    icon: Languages,
    title: "Translate",
    desc: "Translate while preserving natural tone.",
    prompt: "Translate to English:",
  },
  {
    icon: Lightbulb,
    title: "Brainstorm",
    desc: "Generate ideas, names, angles, and options.",
    prompt: "Brainstorm 10 creative ideas for:",
  },
];

const Tools = () => (
  <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14 lg:px-6">
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <p className="text-xs font-semibold uppercase text-cyan-200">
          AI tools
        </p>
        <h1 className="aura-heading mt-2 text-4xl font-black tracking-tight sm:text-5xl">
          Fast actions for any page.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
          Launch assistant commands with prefilled prompts for common Chrome
          workflows.
        </p>
      </div>
      <Link
        to="/assistant"
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm font-bold text-slate-100 transition hover:border-cyan-300/45 hover:bg-white/[0.08]"
      >
        Open Assistant <ArrowRight size={15} />
      </Link>
    </div>
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool) => (
        <article key={tool.title} className="aura-card aura-border p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
            <tool.icon size={20} />
          </div>
          <h2 className="aura-heading mt-4 text-lg font-bold">{tool.title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">{tool.desc}</p>
          <Link
            to="/assistant"
            state={{ prefilledPrompt: tool.prompt }}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-300 to-teal-300 px-3 py-2 text-xs font-bold text-slate-950 transition hover:brightness-110"
          >
            Use command <ArrowRight size={14} />
          </Link>
        </article>
      ))}
    </div>
  </div>
);

export default Tools;
