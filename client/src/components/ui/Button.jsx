const variants = {
  primary:
    "bg-gradient-to-r from-cyan-300 via-teal-300 to-amber-200 text-slate-950 shadow-[0_14px_34px_rgba(34,211,238,0.18)] hover:brightness-110",
  ghost:
    "border border-white/15 bg-white/[0.04] text-slate-200 hover:border-cyan-300/45 hover:bg-white/[0.08]",
  danger:
    "border border-red-400/30 bg-red-500/10 text-red-200 hover:bg-red-500/15",
};

const Button = ({
  children,
  className = "",
  variant = "primary",
  type = "button",
  ...props
}) => (
  <button
    type={type}
    className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-cyan-300 ${variants[variant]} ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default Button;
