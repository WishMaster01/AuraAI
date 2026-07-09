import { createElement, useEffect, useState } from "react";
import { Bot, MessageSquare, Mic, LayoutDashboard, Sparkles } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner.jsx";

const steps = [
  "Connecting secure session",
  "Loading AI assistant modules",
  "Preparing your workspace",
];

const features = [
  { icon: MessageSquare, label: "AI Chat" },
  { icon: Mic, label: "Voice Control" },
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Sparkles, label: "Smart Tools" },
];

const AppLoader = ({ message = "Initializing AuraAI" }) => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((i) => (i + 1) % steps.length);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="aura-page flex min-h-screen flex-col items-center justify-center px-4 text-slate-100">
      <div className="relative z-10 w-full max-w-lg text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg border border-cyan-300/30 bg-cyan-300/10 text-cyan-200 animate-aura-pulse-ring">
          <Bot size={32} />
        </div>
        <h1 className="aura-heading mt-6 text-3xl font-black">
          Aura<span className="aura-gradient-text">AI</span>
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Premium voice and chat assistant for productivity, automation, and insights.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {features.map(({ icon, label }) => (
            <span key={label} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs text-slate-300">
              {createElement(icon, { size: 14, className: "text-cyan-200" })}
              {label}
            </span>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-4">
          <LoadingSpinner size="large" color="blue" />
          <p className="text-sm font-semibold text-cyan-200">{message}</p>
          <p className="text-xs text-slate-500">{steps[stepIndex]}...</p>
        </div>

        <p className="mt-10 text-xs text-slate-600">
          Powered by Gemini | Secure sessions | Built for modern SaaS workflows
        </p>
      </div>
    </div>
  );
};

export default AppLoader;
