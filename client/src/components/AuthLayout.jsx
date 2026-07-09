import { createElement } from "react";
import { Link } from "react-router-dom";
import { Bot, Mic, MessageSquare, Sparkles, Shield, Zap } from "lucide-react";

const highlights = [
  { icon: MessageSquare, text: "Multi-session AI chat with history" },
  { icon: Mic, text: "Voice commands & hands-free control" },
  { icon: Sparkles, text: "Smart prompts & productivity tools" },
  { icon: Shield, text: "Secure auth & encrypted sessions" },
];

const AuthLayout = ({ title, subtitle, children, footer }) => (
  <div className="aura-page min-h-screen text-slate-100">
    <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-between overflow-hidden border-r border-white/10 bg-slate-950/50 p-10 lg:flex">
        <div>
          <Link to="/" className="aura-heading inline-flex items-center gap-2 text-2xl font-bold">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-300/30 bg-cyan-300/10">
              <Bot className="text-cyan-300" size={23} />
            </span>
            Aura<span className="aura-gradient-text">AI</span>
          </Link>
          <p className="mt-6 max-w-sm text-sm leading-6 text-slate-300">
            Your Chrome-ready AI command center for voice, chat, automation, and daily productivity.
          </p>
          <ul className="mt-8 space-y-4">
            {highlights.map(({ icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-sm text-slate-300">
                {createElement(icon, {
                  className: "mt-0.5 shrink-0 text-cyan-300",
                  size: 18,
                })}
                {text}
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { label: "AI Models", value: "Gemini" },
            { label: "Uptime", value: "99.9%" },
            { label: "Latency", value: "<2s" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="aura-card px-3 py-4"
            >
              <p className="aura-heading text-lg font-semibold text-cyan-200">{stat.value}</p>
              <p className="mt-1 text-xs text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </aside>

      <div className="flex flex-col justify-center px-4 py-8 sm:px-8">
        <div className="mb-6 flex items-center gap-2 lg:hidden">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-300/30 bg-cyan-300/10">
            <Zap className="text-cyan-300" size={19} />
          </span>
          <span className="aura-heading text-xl font-bold">
            Aura<span className="aura-gradient-text">AI</span>
          </span>
        </div>
        <div className="mx-auto w-full max-w-md">
          <h1 className="aura-heading text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">{subtitle}</p>
          <div className="aura-glass aura-border mt-8 rounded-lg p-5 sm:p-6">
            {children}
          </div>
          {footer && <div className="mt-6 text-center text-sm text-slate-400">{footer}</div>}
        </div>
      </div>
    </div>
  </div>
);

export default AuthLayout;
