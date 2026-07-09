import {
  Scale,
  FileText,
  AlertTriangle,
  ShieldCheck,
  Ban,
  CheckCircle2,
  Gavel,
} from "lucide-react";
import BackButton from "../components/ui/BackButton.jsx";

const legalCards = [
  {
    icon: FileText,
    title: "Terms of use",
    desc: "Rules for using AuraAI, its browser assistant, AI tools, dashboard, and related services.",
  },
  {
    icon: ShieldCheck,
    title: "Responsible AI usage",
    desc: "Users are responsible for reviewing AI-generated outputs before relying on them.",
  },
  {
    icon: Ban,
    title: "Restricted use",
    desc: "AuraAI must not be used for harmful, illegal, abusive, deceptive, or privacy-invasive activities.",
  },
];

const sections = [
  {
    title: "Acceptance of terms",
    items: [
      "By using AuraAI, users agree to follow these Legal Terms and all applicable laws.",
      "If a user does not agree with these terms, they should not use the application.",
      "AuraAI may update these terms as the product evolves.",
    ],
  },
  {
    title: "Use of AuraAI",
    items: [
      "AuraAI provides AI-assisted browser productivity features including chat, voice commands, summaries, rewriting, translation, and prompt workflows.",
      "Users are responsible for the commands, prompts, selected text, page content, and other information they submit.",
      "Users must verify AI-generated answers before using them for important decisions.",
    ],
  },
  {
    title: "Prohibited activities",
    items: [
      "Do not use AuraAI to violate laws, platform rules, intellectual property rights, or privacy rights.",
      "Do not use AuraAI to generate malware, phishing content, scams, spam, or harmful automation.",
      "Do not attempt to reverse engineer, abuse, overload, or bypass security protections.",
      "Do not submit highly sensitive personal, financial, medical, or confidential data unless you understand the risk.",
    ],
  },
  {
    title: "AI output disclaimer",
    items: [
      "AI-generated content may be inaccurate, incomplete, outdated, or unsuitable for a specific purpose.",
      "AuraAI does not provide legal, medical, financial, or professional advice.",
      "Users should independently verify outputs before taking action.",
    ],
  },
  {
    title: "Service availability",
    items: [
      "AuraAI may depend on third-party AI providers, hosting platforms, APIs, and browser services.",
      "The service may be interrupted due to maintenance, provider failures, network issues, or product updates.",
      "No guarantee is made that the service will always be available, error-free, or uninterrupted.",
    ],
  },
  {
    title: "Limitation of liability",
    items: [
      "AuraAI is provided on an as-is and as-available basis.",
      "The project owner or team is not liable for indirect losses, data loss, missed opportunities, or damages caused by reliance on AI outputs.",
      "Users are responsible for how they use the application and any generated content.",
    ],
  },
];

const Legal = () => (
  <main className="relative overflow-hidden">
    <BackButton to="/" label="Back" className="absolute left-4 top-4 z-20 sm:left-6 sm:top-6" />
    <div className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
    </div>

    <section className="mx-auto max-w-7xl px-4 py-12 sm:py-16 lg:px-8 lg:py-20">
      <div className="max-w-4xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200">
          <Scale size={15} />
          Legal
        </div>

        <h1 className="aura-heading mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
          Legal terms for using AuraAI responsibly.
        </h1>

        <p className="mt-6 text-base leading-8 text-slate-300 sm:text-lg">
          These Legal Terms explain the basic rules, responsibilities,
          restrictions, and disclaimers for using AuraAI as a virtual Chrome AI
          assistant.
        </p>

        <p className="mt-4 text-sm text-slate-500">
          Last updated: January 2026
        </p>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {legalCards.map((card) => (
          <article
            key={card.title}
            className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-6 backdrop-blur transition hover:-translate-y-1 hover:border-cyan-300/30"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-200 ring-1 ring-cyan-300/20">
              <card.icon size={22} />
            </span>
            <h2 className="aura-heading mt-5 font-bold">{card.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">{card.desc}</p>
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
                <Gavel size={20} />
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

      <div className="mt-10 rounded-[2rem] border border-red-300/20 bg-red-300/10 p-6">
        <div className="flex gap-3">
          <AlertTriangle className="mt-0.5 shrink-0 text-red-200" size={22} />
          <p className="text-sm leading-7 text-red-100">
            This legal page is a project-ready template, not legal advice.
            Before launching AuraAI publicly, update this page according to your
            actual business model, AI providers, payment system, data practices,
            and local laws.
          </p>
        </div>
      </div>
    </section>
  </main>
);

export default Legal;
