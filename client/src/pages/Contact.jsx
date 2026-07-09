import {
  Mail,
  Clock,
  MessageSquare,
  Send,
  HelpCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import BackButton from "../components/ui/BackButton.jsx";

const contactCards = [
  {
    icon: Mail,
    title: "Email support",
    desc: "support@auraai.app",
    color: "text-cyan-200",
  },
  {
    icon: Clock,
    title: "Response SLA",
    desc: "Within 24 hours on business days.",
    color: "text-teal-200",
  },
  {
    icon: MessageSquare,
    title: "Product help",
    desc: "Assistant setup, prompts, tools, and dashboard guidance.",
    color: "text-amber-200",
  },
];

const helpTopics = [
  "Chrome extension setup",
  "AI assistant configuration",
  "Gemini/OpenRouter API integration",
  "Voice command troubleshooting",
  "Prompt workflow guidance",
  "Billing and onboarding support",
];

const Contact = () => (
  <main className="relative overflow-hidden">
    <BackButton to="/" label="Back" className="absolute left-4 top-4 z-20 sm:left-6 sm:top-6" />
    <div className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute left-20 top-10 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
    </div>

    <section className="mx-auto max-w-7xl px-4 py-12 sm:py-16 lg:px-8 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200">
            <HelpCircle size={15} />
            Contact AuraAI
          </div>

          <h1 className="aura-heading mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Support for launch, setup, and onboarding.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            Need help with AuraAI setup, Chrome assistant workflows, API
            integration, onboarding, or product support? Reach the team and get
            clear guidance.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {contactCards.map((item) => (
              <div
                key={item.title}
                className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-5 shadow-xl shadow-slate-950/20 backdrop-blur transition hover:-translate-y-1 hover:border-cyan-300/30"
              >
                <item.icon className={item.color} size={22} />
                <p className="aura-heading mt-4 font-bold">{item.title}</p>
                <p className="mt-2 break-words text-sm leading-6 text-slate-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl">
          <form className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-200 ring-1 ring-cyan-300/20">
                <Send size={20} />
              </span>
              <div>
                <h2 className="aura-heading text-xl font-bold">
                  Send a message
                </h2>
                <p className="text-sm text-slate-400">
                  Tell us what you need help with.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              <input
                type="text"
                placeholder="Your name"
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50 focus:ring-4 focus:ring-cyan-300/10"
              />
              <input
                type="email"
                placeholder="Email address"
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50 focus:ring-4 focus:ring-cyan-300/10"
              />
              <select className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-300 outline-none transition focus:border-cyan-300/50 focus:ring-4 focus:ring-cyan-300/10">
                <option>General support</option>
                <option>Chrome extension setup</option>
                <option>AI API integration</option>
                <option>Billing support</option>
                <option>Enterprise onboarding</option>
              </select>
              <textarea
                rows="5"
                placeholder="Describe your issue or request..."
                className="resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-300/50 focus:ring-4 focus:ring-cyan-300/10"
              />
              <button
                type="button"
                className="rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:shadow-cyan-500/30"
              >
                Submit request
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-14 grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl lg:grid-cols-2 lg:p-8">
        <div>
          <Sparkles className="text-cyan-200" size={26} />
          <h2 className="aura-heading mt-4 text-3xl font-black">
            What we can help with
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            From assistant configuration to browser workflows, AuraAI support is
            focused on helping you ship a reliable AI-powered Chrome experience.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {helpTopics.map((topic) => (
            <div
              key={topic}
              className="flex gap-3 rounded-2xl bg-slate-950/40 p-4"
            >
              <ShieldCheck
                className="mt-0.5 shrink-0 text-emerald-300"
                size={18}
              />
              <p className="text-sm text-slate-300">{topic}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </main>
);

export default Contact;
