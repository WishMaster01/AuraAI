import { Link } from "react-router-dom";
import { useState } from "react";
import {
  ArrowRight,
  Bot,
  Check,
  Chrome,
  Cpu,
  MessageSquare,
  Mic,
  Sparkles,
} from "lucide-react";
import heroAssistant from "../assets/image1.png";

const cards = [
  {
    title: "Voice Assistant",
    desc: "Hands-free prompts, browser actions, and fast answers.",
    icon: Mic,
  },
  {
    title: "AI Chat",
    desc: "Multi-session assistant chat with markdown and export.",
    icon: MessageSquare,
  },
  {
    title: "AI Tools Hub",
    desc: "Summarize, explain, rewrite, translate, and draft.",
    link: "/tools",
    icon: Sparkles,
  },
  {
    title: "Prompt Library",
    desc: "Production-ready prompts for browser workflows.",
    link: "/prompts",
    icon: Cpu,
  },
];

const faqs = [
  {
    q: "Can I use AuraAI on mobile?",
    a: "Yes. Layouts are mobile-first and tuned for phones, tablets, laptops, and desktops.",
  },
  {
    q: "Does AuraAI support voice and text together?",
    a: "Yes. You can switch between voice commands, text chat, and quick actions in the assistant.",
  },
  {
    q: "Is my conversation secure?",
    a: "Authenticated routes remain protected and the UI keeps session logic untouched.",
  },
];

const workflow = [
  "Install and sign in",
  "Customize your assistant",
  "Ask, summarize, rewrite, translate",
];

const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 lg:px-6">
      <section className="grid min-h-[calc(100vh-8rem)] items-center gap-8 py-6 lg:grid-cols-[1fr_0.9fr] lg:py-10">
        <div className="animate-aura-fade-up">
          <div className="inline-flex items-center gap-2 rounded-lg border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-xs font-semibold text-cyan-100">
            <Chrome size={14} /> AI-powered Chrome assistant
          </div>
          <h1 className="aura-heading mt-6 max-w-3xl text-4xl font-black leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl">
            Aura<span className="aura-gradient-text">AI</span> turns your
            browser into a command center.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Premium assistant chat, voice commands, page summaries, rewrites,
            translations, and smart browser workflows in one responsive
            interface.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-300 via-teal-300 to-amber-200 px-5 py-3 text-sm font-bold text-slate-950 shadow-[0_16px_42px_rgba(34,211,238,0.18)] transition hover:-translate-y-0.5 hover:brightness-110"
            >
              Start Free <ArrowRight size={16} />
            </Link>
            <Link
              to="/features"
              className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-bold text-slate-100 transition hover:border-cyan-300/45 hover:bg-white/[0.08]"
            >
              Explore Features
            </Link>
          </div>
          <div className="mt-8 grid max-w-xl grid-cols-3 gap-3 text-center">
            {[
              ["6", "quick tools"],
              ["50", "chat history"],
              ["24/7", "assistant"],
            ].map(([value, label]) => (
              <div key={label} className="aura-card px-3 py-4">
                <p className="aura-heading text-xl font-bold text-cyan-100">
                  {value}
                </p>
                <p className="mt-1 text-xs text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="aura-glass aura-border relative overflow-hidden rounded-lg p-4 animate-aura-fade-up lg:p-5">
          <div className="grid gap-4 sm:grid-cols-[0.8fr_1fr]">
            <div className="overflow-hidden rounded-lg border border-white/10 bg-slate-950/70">
              <img
                src={heroAssistant}
                alt="AuraAI assistant avatar"
                loading="lazy"
                className="h-full min-h-72 w-full object-cover"
              />
            </div>
            <div className="flex min-h-72 flex-col justify-between rounded-lg border border-white/10 bg-black/25 p-4">
              <div>
                <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-cyan-100">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-300/10">
                    <Bot size={15} />
                  </span>
                  Live assistant preview
                </div>
                <div className="space-y-3">
                  <div className="max-w-[88%] rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-sm text-slate-200">
                    Summarize this page and extract action items.
                  </div>
                  <div className="ml-auto max-w-[86%] rounded-lg bg-gradient-to-r from-cyan-300 to-teal-300 px-3 py-2 text-sm font-medium text-slate-950">
                    Done. I found 5 takeaways and 3 next steps.
                  </div>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {["Summarize", "Rewrite", "Translate", "Save note"].map(
                  (chip) => (
                    <span
                      key={chip}
                      className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs text-slate-300"
                    >
                      {chip}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <article key={card.title} className="aura-card aura-border p-5">
            <card.icon className="text-cyan-200" size={22} />
            <h2 className="aura-heading mt-4 text-lg font-bold">
              {card.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">{card.desc}</p>
            {card.link && (
              <Link
                to={card.link}
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-cyan-200 hover:text-cyan-100"
              >
                Learn more <ArrowRight size={14} />
              </Link>
            )}
          </article>
        ))}
      </section>

      <section className="mt-16 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-xs font-semibold uppercase text-cyan-200">
            Workflow
          </p>
          <h2 className="aura-heading mt-2 text-3xl font-bold sm:text-4xl">
            Built for fast browser actions.
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Clear task hierarchy keeps the assistant useful in a small extension
            popup and comfortable on desktop.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {workflow.map((step, idx) => (
            <div key={step} className="aura-card p-5">
              <p className="text-xs font-bold text-amber-200">STEP {idx + 1}</p>
              <p className="aura-heading mt-3 text-lg font-bold">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-4 md:grid-cols-3">
        {[
          "Cut repetitive research into clear summaries.",
          "Voice commands feel immediate and focused.",
          "The compact assistant layout demos beautifully.",
        ].map((quote) => (
          <article key={quote} className="aura-card p-5">
            <Check className="text-teal-200" size={20} />
            <p className="mt-4 text-sm leading-6 text-slate-300">{quote}</p>
          </article>
        ))}
      </section>

      <section className="mt-16 grid gap-8 lg:grid-cols-[0.7fr_1fr]">
        <div>
          <p className="text-xs font-semibold uppercase text-cyan-200">FAQ</p>
          <h2 className="aura-heading mt-2 text-3xl font-bold">
            Answers before launch.
          </h2>
        </div>
        <div className="space-y-3">
          {faqs.map((item, idx) => (
            <div key={item.q} className="aura-card overflow-hidden">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm font-semibold"
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
              >
                {item.q}
                <span className="text-cyan-200">
                  {openFaq === idx ? "-" : "+"}
                </span>
              </button>
              {openFaq === idx && (
                <p className="px-4 pb-4 text-sm leading-6 text-slate-400">
                  {item.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-16 grid gap-6 border-t border-white/10 py-10 text-sm text-slate-400 md:grid-cols-4">
        <div>
          <Link to="/" className="aura-heading font-bold text-slate-100">
            AuraAI
          </Link>
          <p className="mt-2">Premium AI assistant experience.</p>
        </div>
        <div>
          <Link to="/features" className="font-semibold text-slate-200">
            Product
          </Link>
          <Link to="/assistant" className="mt-2 block">
            Assistant
          </Link>
          <Link to="/dashboard" className="block">
            Dashboard
          </Link>
          <Link to="/pricing" className="block">
            Pricing
          </Link>
        </div>
        <div>
          <p className="font-semibold text-slate-200">Company</p>
          <Link to="/about" className="mt-2 block">
            About
          </Link>
          <Link to="/contact" className="block">
            Contact
          </Link>
        </div>
        <div>
          <p className="font-semibold text-slate-200">Legal</p>
          <Link to="/privacy" className="mt-2 block">
            Privacy
          </Link>
          <Link to="/legal" className="block">
            Terms
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
