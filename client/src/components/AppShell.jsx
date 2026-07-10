import { Link, NavLink, Outlet } from "react-router-dom";
import { useContext, useState } from "react";
import { useUser } from "@clerk/react";
import {
  Menu,
  X,
  Home,
  Sparkles,
  Bot,
  LayoutDashboard,
  Tag,
  Chrome,
  WandSparkles,
} from "lucide-react";
import { userDataContext } from "../context/UserContext.jsx";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/features", label: "Features" },
  { to: "/tools", label: "AI Tools" },
  { to: "/prompts", label: "Prompts" },
  { to: "/assistant", label: "Assistant" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/pricing", label: "Pricing" },
];

const AppShell = () => {
  const [open, setOpen] = useState(false);
  const { userData } = useContext(userDataContext);
  const { isLoaded: isClerkLoaded, isSignedIn, user } = useUser();
  const signedInUser = isClerkLoaded && isSignedIn ? user : null;

  return (
    <div className="aura-page min-h-screen pb-20 text-slate-100 md:pb-0">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/72 backdrop-blur-2xl">
        <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 lg:px-6">
          <Link to="/" className="aura-heading group inline-flex items-center gap-2 text-xl font-bold tracking-tight">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-300/30 bg-cyan-300/10 text-cyan-200 shadow-[0_0_28px_rgba(34,211,238,0.16)] transition group-hover:scale-105">
              <Chrome size={19} />
            </span>
            Aura<span className="aura-gradient-text">AI</span>
          </Link>

          <button
            className="rounded-lg border border-white/15 bg-white/[0.04] p-2 transition hover:border-cyan-300/45 hover:bg-white/[0.08] md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>

          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-cyan-300/12 text-cyan-200 shadow-[inset_0_0_0_1px_rgba(103,232,249,0.18)]"
                      : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
                  }`
                }
                >
                  {item.label}
                </NavLink>
            ))}
            {signedInUser ? (
              <Link
                to="/assistant"
                className="ml-2 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.05] px-2.5 py-2 text-sm font-semibold text-slate-100 transition hover:border-cyan-300/45 hover:bg-white/[0.08]"
              >
                <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-slate-900/80">
                  {signedInUser.imageUrl ? (
                    <img
                      src={signedInUser.imageUrl}
                      alt={signedInUser.fullName || signedInUser.firstName || "User avatar"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-bold text-cyan-200">
                      {(signedInUser.firstName || "U").charAt(0).toUpperCase()}
                    </span>
                  )}
                </span>
                <span className="max-w-36 truncate">
                  {signedInUser.fullName || signedInUser.firstName || "Open App"}
                </span>
              </Link>
            ) : (
              <Link
                to={userData ? "/assistant" : "/login"}
                className="ml-2 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-300 via-teal-300 to-amber-200 px-4 py-2.5 text-sm font-bold text-slate-950 shadow-[0_14px_34px_rgba(34,211,238,0.18)] transition hover:-translate-y-0.5 hover:brightness-110"
              >
                <WandSparkles size={16} />
                Get Started
              </Link>
            )}
          </div>
        </nav>
        {open && (
          <div className="border-t border-white/10 bg-slate-950/92 px-4 py-3 backdrop-blur-2xl md:hidden">
            <div className="mx-auto flex max-w-2xl flex-col gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2 text-sm font-medium transition ${
                      isActive
                        ? "bg-cyan-300/12 text-cyan-200"
                        : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
                    }`
                  }
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </header>
      <main role="main">
        <Outlet />
      </main>
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-slate-950/92 px-2 py-2 backdrop-blur-2xl md:hidden"
        aria-label="Mobile bottom navigation"
      >
        <div className="mx-auto grid max-w-2xl grid-cols-5 gap-1">
          {[
            { to: "/", label: "Home", icon: Home },
            { to: "/tools", label: "Tools", icon: Sparkles },
            { to: "/assistant", label: "Chat", icon: Bot },
            { to: "/prompts", label: "Prompts", icon: Tag },
            { to: "/dashboard", label: "Dash", icon: LayoutDashboard },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex min-h-12 flex-col items-center justify-center rounded-lg px-2 py-1.5 text-[0.68rem] font-medium transition ${
                  isActive
                    ? "bg-cyan-300/12 text-cyan-200 shadow-[inset_0_0_0_1px_rgba(103,232,249,0.14)]"
                    : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-200"
                }`
              }
            >
              <item.icon size={15} />
              <span className="mt-1">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default AppShell;
