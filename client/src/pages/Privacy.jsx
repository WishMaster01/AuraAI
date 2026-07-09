import {
  Shield,
  Lock,
  Database,
  Eye,
  UserCheck,
  Server,
  CheckCircle2,
} from "lucide-react";
import BackButton from "../components/ui/BackButton.jsx";

const privacyPoints = [
  {
    icon: Lock,
    title: "Secure by design",
    desc: "AuraAI is designed to keep API keys, AI processing, and sensitive operations on the backend.",
  },
  {
    icon: Database,
    title: "Minimal data usage",
    desc: "We only process data required to provide assistant features, page actions, and user workflows.",
  },
  {
    icon: Eye,
    title: "Transparent processing",
    desc: "When AuraAI summarizes, rewrites, or explains content, the selected text or page content may be sent to AI services.",
  },
  {
    icon: UserCheck,
    title: "User control",
    desc: "Users should control what they submit, save, summarize, or send to the assistant.",
  },
];

const sections = [
  {
    title: "Information AuraAI may process",
    items: [
      "Account information such as name, email, and authentication details.",
      "Assistant messages, voice commands, prompts, and workflow inputs.",
      "Selected webpage text or page content when you request browser actions.",
      "Technical data such as device type, browser type, logs, and usage events.",
    ],
  },
  {
    title: "How information is used",
    items: [
      "To provide AI chat, voice commands, summaries, rewrites, translations, and browser actions.",
      "To improve reliability, prevent abuse, debug errors, and maintain product security.",
      "To personalize assistant responses and maintain user preferences where applicable.",
      "To support onboarding, billing, customer support, and product communication.",
    ],
  },
  {
    title: "AI provider processing",
    items: [
      "AuraAI may use external AI providers such as Gemini or OpenRouter-connected models.",
      "Submitted prompts, selected text, or page content may be processed by these providers to generate responses.",
      "API keys must remain on the backend and must never be exposed in client-side code.",
      "Avoid sending passwords, private documents, financial details, or highly sensitive data unless necessary.",
    ],
  },
  {
    title: "Data protection practices",
    items: [
      "Backend validation should be used for AI responses and user-submitted actions.",
      "Prompt length and page content length should be limited before AI processing.",
      "Production logs should avoid storing complete private page content.",
      "Reasonable security controls should be applied to authentication, API routes, and stored user data.",
    ],
  },
];

const Privacy = () => (
  <main className="relative overflow-hidden">
    <BackButton to="/" label="Back" className="absolute left-4 top-4 z-20 sm:left-6 sm:top-6" />
    <div className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
    </div>

    <section className="mx-auto max-w-7xl px-4 py-12 sm:py-16 lg:px-8 lg:py-20">
      <div className="max-w-4xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200">
          <Shield size={15} />
          Privacy Policy
        </div>

        <h1 className="aura-heading mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
          Privacy built for an AI-powered browser assistant.
        </h1>

        <p className="mt-6 text-base leading-8 text-slate-300 sm:text-lg">
          This Privacy Policy explains how AuraAI may collect, use, process, and
          protect information when users interact with the virtual Chrome
          assistant, AI chat, voice commands, page tools, and related workflows.
        </p>

        <p className="mt-4 text-sm text-slate-500">
          Last updated: January 2026
        </p>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {privacyPoints.map((point) => (
          <article
            key={point.title}
            className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-6 backdrop-blur transition hover:-translate-y-1 hover:border-cyan-300/30"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-200 ring-1 ring-cyan-300/20">
              <point.icon size={22} />
            </span>
            <h2 className="aura-heading mt-5 font-bold">{point.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              {point.desc}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-12 grid gap-6">
        {sections.map((section) => (
          <section
            key={section.title}
            className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl lg:p-8"
          >
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950/60 text-cyan-200 ring-1 ring-white/10">
                <Server size={20} />
              </span>
              <div>
                <h2 className="aura-heading text-2xl font-black">
                  {section.title}
                </h2>
                <div className="mt-5 grid gap-3">
                  {section.items.map((item) => (
                    <div key={item} className="flex gap-3">
                      <CheckCircle2
                        className="mt-0.5 shrink-0 text-emerald-300"
                        size={18}
                      />
                      <p className="text-sm leading-6 text-slate-400">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      <div className="mt-10 rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-6 text-sm leading-7 text-amber-100">
        This page is a project-ready privacy template. Before production launch,
        review it with a qualified legal professional and update it according to
        your actual data storage, AI providers, analytics, cookies, and regional
        compliance needs.
      </div>
    </section>
  </main>
);

export default Privacy;
