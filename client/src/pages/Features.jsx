import { createElement } from "react";
import { Link } from "react-router-dom";
import {
  MessageSquare,
  Mic,
  LayoutDashboard,
  Sparkles,
  BookOpen,
  Shield,
  Zap,
  History,
  ArrowRight,
} from "lucide-react";

const features = [
  { icon: MessageSquare, title: "AI Chat Sessions", desc: "Pin, rename, search, export, and render markdown across focused assistant threads." },
  { icon: Mic, title: "Voice Assistant", desc: "Speak naturally and run hands-free browser commands in a compact assistant UI." },
  { icon: Sparkles, title: "AI Tools Hub", desc: "Summarize, explain code, draft emails, translate, rewrite, and brainstorm.", link: "/tools" },
  { icon: BookOpen, title: "Prompt Library", desc: "Curated prompts for productivity, development, writing, and business.", link: "/prompts" },
  { icon: LayoutDashboard, title: "Analytics Dashboard", desc: "Track activity, sessions, commands, and assistant configuration at a glance.", link: "/dashboard" },
  { icon: History, title: "Command History", desc: "Recall previous actions quickly and keep workflows continuous." },
  { icon: Shield, title: "Secure by Design", desc: "Protected routes and authenticated sessions without changing core auth logic." },
  { icon: Zap, title: "Fast and Responsive", desc: "Mobile-first layouts with lazy routes and extension-friendly density." },
];

const Features = () => (
  <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14 lg:px-6">
    <div className="max-w-3xl">
      <p className="text-xs font-semibold uppercase text-cyan-200">Feature matrix</p>
      <h1 className="aura-heading mt-2 text-4xl font-black tracking-tight sm:text-5xl">A complete AI browser assistant.</h1>
      <p className="mt-4 text-base leading-7 text-slate-400">
        Everything is tuned for a premium SaaS feel while staying practical in extension-sized layouts.
      </p>
    </div>
    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {features.map(({ icon, title, desc, link }) => (
        <article key={title} className="aura-card aura-border p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
            {createElement(icon, { size: 20 })}
          </div>
          <h2 className="aura-heading mt-4 font-bold">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">{desc}</p>
          {link && (
            <Link to={link} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-cyan-200 hover:text-cyan-100">
              Explore <ArrowRight size={14} />
            </Link>
          )}
        </article>
      ))}
    </div>
  </div>
);

export default Features;
