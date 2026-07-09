import {
  Bot,
  Chrome,
  Shield,
  Sparkles,
  Zap,
  Mic,
  Brain,
  Workflow,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import BackButton from "../components/ui/BackButton.jsx";

const points = [
  {
    icon: Chrome,
    title: "Browser-first experience",
    desc: "Built for Chrome workflows like page summaries, selected text actions, quick commands, and assistant overlays.",
  },
  {
    icon: Sparkles,
    title: "AI-native productivity",
    desc: "Chat, voice, prompts, and browser tools work from one consistent intelligent command surface.",
  },
  {
    icon: Shield,
    title: "Production-aware design",
    desc: "Enterprise-level UI improvements without breaking authentication, routing, API, state, or extension logic.",
  },
];

const capabilities = [
  "Voice-based command execution",
  "AI chat for browser productivity",
  "Page summarization and key point extraction",
  "Selected text explanation and rewriting",
  "Prompt workflows for daily tasks",
  "Secure backend-first AI processing",
];

const About = () => (
  <main className="relative overflow-hidden">
    <BackButton to="/" label="Back" className="absolute left-4 top-4 z-20 sm:left-6 sm:top-6" />
    <div className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="absolute right-0 top-48 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
    </div>

    <section className="mx-auto max-w-7xl px-4 py-12 sm:py-16 lg:px-8 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200">
            <Bot size={15} />
            About AuraAI
          </div>

          <h1 className="aura-heading mt-6 max-w-4xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            A premium AI command layer for your browser.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            AuraAI turns the browser into an intelligent workspace. It combines
            assistant chat, voice commands, prompt workflows, page intelligence,
            and Chrome-native actions into one focused productivity experience.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button className="group rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:shadow-cyan-500/30">
              Explore features
              <ArrowRight
                className="ml-2 inline transition group-hover:translate-x-1"
                size={16}
              />
            </button>
            <button className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-slate-100 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/10">
              View commands
            </button>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-cyan-950/40 backdrop-blur-xl">
          <div className="rounded-[1.5rem] border border-cyan-300/10 bg-slate-950/70 p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-200 ring-1 ring-cyan-300/20">
                  <Bot size={24} />
                </span>
                <div>
                  <p className="aura-heading font-bold">AuraAI Assistant</p>
                  <p className="text-sm text-slate-400">
                    Browser productivity engine
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                Active
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { icon: Mic, label: "Voice commands" },
                { icon: Brain, label: "AI reasoning" },
                { icon: Workflow, label: "Task workflows" },
                { icon: Zap, label: "Fast actions" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-cyan-300/10"
                >
                  <item.icon className="text-cyan-200" size={22} />
                  <p className="mt-3 text-sm font-semibold text-slate-100">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-cyan-300/10 bg-gradient-to-br from-cyan-300/10 to-blue-500/10 p-5">
              <p className="text-sm font-semibold text-cyan-100">
                Assistant mission
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Make everyday browser tasks faster, clearer, repeatable, and
                easier to execute with natural language.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {points.map((point) => (
          <article
            key={point.title}
            className="group rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-6 shadow-xl shadow-slate-950/20 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/[0.08]"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-200 ring-1 ring-cyan-300/20">
              <point.icon size={22} />
            </span>
            <h2 className="aura-heading mt-5 text-lg font-bold">
              {point.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              {point.desc}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-14 grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl lg:grid-cols-2 lg:p-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-200">
            What AuraAI does
          </p>
          <h2 className="aura-heading mt-3 text-3xl font-black">
            Built for real browser productivity.
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            AuraAI is designed to reduce repetitive browser work by combining AI
            reasoning with direct command execution.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {capabilities.map((item) => (
            <div
              key={item}
              className="flex gap-3 rounded-2xl bg-slate-950/40 p-4"
            >
              <CheckCircle2
                className="mt-0.5 shrink-0 text-emerald-300"
                size={18}
              />
              <p className="text-sm text-slate-300">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </main>
);

export default About;
