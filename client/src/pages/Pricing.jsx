const plans = [
  { name: "Starter", price: "$0", badge: "Explore", items: ["Basic AI chat", "5 voice sessions/day", "Community support"] },
  { name: "Pro", price: "$19", badge: "Popular", items: ["Unlimited chat", "Advanced voice", "History export", "Priority support"], featured: true },
  { name: "Team", price: "$49", badge: "Scale", items: ["Shared workspaces", "Analytics dashboard", "Admin controls"] },
];

const Pricing = () => (
  <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14 lg:px-6">
    <div className="max-w-3xl">
      <p className="text-xs font-semibold uppercase text-cyan-200">Pricing</p>
      <h1 className="aura-heading mt-2 text-4xl font-black tracking-tight sm:text-5xl">Plans that grow with your assistant.</h1>
      <p className="mt-4 text-sm leading-6 text-slate-400">Keep the interface premium and focused from solo use to team workflows.</p>
    </div>
    <div className="mt-8 grid gap-5 md:grid-cols-3">
      {plans.map((plan) => (
        <article key={plan.name} className={`aura-card p-6 ${plan.featured ? "border-cyan-300/45 bg-cyan-300/10" : ""}`}>
          <div className="flex items-center justify-between gap-4">
            <h2 className="aura-heading text-xl font-bold">{plan.name}</h2>
            <span className="rounded-lg border border-white/10 bg-white/[0.05] px-2.5 py-1 text-xs font-semibold text-cyan-100">{plan.badge}</span>
          </div>
          <p className="aura-heading mt-5 text-4xl font-black">{plan.price}<span className="text-sm font-medium text-slate-400">/mo</span></p>
          <ul className="mt-5 space-y-2 text-sm text-slate-300">
            {plan.items.map((it) => (
              <li key={it} className="flex gap-2"><span className="text-teal-200">+</span>{it}</li>
            ))}
          </ul>
          <button className="mt-7 w-full rounded-lg bg-gradient-to-r from-cyan-300 to-teal-300 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:brightness-110">
            Choose {plan.name}
          </button>
        </article>
      ))}
    </div>
  </div>
);

export default Pricing;
