import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const BackButton = ({ to = "/", label = "Back", className = "" }) => (
  <Link
    to={to}
    className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-sm font-semibold text-slate-200 transition hover:-translate-y-0.5 hover:border-cyan-300/45 hover:bg-white/[0.1] hover:text-white focus-visible:outline-cyan-300 ${className}`}
    aria-label={label}
  >
    <ArrowLeft size={16} />
    <span>{label}</span>
  </Link>
);

export default BackButton;

