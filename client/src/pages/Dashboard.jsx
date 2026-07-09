import { createElement, useContext } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Sparkles, BookOpen, Mic, ArrowRight, Activity, Gauge, UserRound } from "lucide-react";
import { userDataContext } from "../context/UserContext.jsx";

const quickActions = [
  { to: "/assistant", label: "Open Assistant", icon: MessageSquare, desc: "Continue chatting" },
  { to: "/tools", label: "AI Tools", icon: Sparkles, desc: "Summarize, code, email" },
  { to: "/prompts", label: "Prompt Library", icon: BookOpen, desc: "Ready-made prompts" },
  { to: "/customize", label: "Customize", icon: Mic, desc: "Avatar and assistant name" },
];

const Dashboard = () => {
  const { userData } = useContext(userDataContext);
  const history = Array.isArray(userData?.history) ? userData.history : [];
  const chatCount = userData?.chatSessions?.length ?? 0;

  const stats = [
    { label: "Assistant", value: userData?.assistantName || "Not configured", icon: UserRound },
    { label: "Chat Sessions", value: chatCount || history.length, icon: MessageSquare },
    { label: "Commands Run", value: history.length, icon: Activity },
    { label: "Plan", value: "Starter", icon: Gauge, accent: true },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10 lg:px-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-semibold uppercase text-cyan-200">Workspace</p>
          <h1 className="aura-heading mt-2 text-4xl font-black tracking-tight sm:text-5xl">Dashboard</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Welcome back, {userData?.name || "User"}. Here is your assistant overview.
          </p>
        </div>
        <Link to="/assistant" className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-300 to-teal-300 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:brightness-110">
          Launch Assistant <ArrowRight size={15} />
        </Link>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="aura-card p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase text-slate-400">{stat.label}</p>
              {createElement(stat.icon, { className: "text-cyan-200", size: 18 })}
            </div>
            <p className={`aura-heading mt-3 truncate text-2xl font-black ${stat.accent ? "text-cyan-100" : "text-slate-50"}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <section className="mt-8">
        <h2 className="aura-heading text-xl font-bold">Quick actions</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map(({ to, label, icon, desc }) => (
            <Link key={to} to={to} className="aura-card group flex items-center justify-between p-4">
              <div>
                {createElement(icon, { className: "text-cyan-200", size: 20 })}
                <p className="mt-3 font-semibold">{label}</p>
                <p className="text-xs text-slate-500">{desc}</p>
              </div>
              <ArrowRight size={16} className="text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-cyan-200" />
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8 aura-glass rounded-lg p-5">
        <h2 className="aura-heading text-xl font-bold">Recent activity</h2>
        <div className="mt-4 space-y-3">
          {history.length > 0 ? (
            history.slice(0, 8).map((h, i) => (
              <p key={`${h}-${i}`} className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-300">
                {h}
              </p>
            ))
          ) : (
            <p className="text-sm text-slate-400">
              No activity yet. <Link to="/assistant" className="font-semibold text-cyan-200 hover:text-cyan-100">Start a conversation</Link>
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
