import { Loader2, Mic, Send, Sparkles } from "lucide-react";

const CommandInput = ({
  value,
  onChange,
  onSubmit,
  onVoice,
  inputRef,
  placeholder = "Type a command or ask anything...",
  isListening = false,
  isSubmitting = false,
}) => {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.();
      }}
      className="border-t border-white/10 bg-slate-950/35 p-3"
    >
      <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/25 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
        <button
          type="button"
          onClick={onVoice}
          className={`rounded-lg p-2 transition focus-visible:outline-cyan-300 ${
            isListening
              ? "bg-cyan-300/15 text-cyan-100 animate-pulse"
              : "text-cyan-200 hover:bg-white/[0.08]"
          }`}
          aria-label="Start voice input"
        >
          <Mic size={18} />
        </button>

        <input
          ref={inputRef}
          className="w-full bg-transparent px-2 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500"
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          aria-label="Chat message input"
        />

        <button
          type="button"
          className="hidden rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.08] sm:inline-flex"
          aria-label="AI options"
        >
          <Sparkles size={14} className="mr-1.5 text-cyan-200" />
          AI
        </button>

        <button
          type="submit"
          disabled={isSubmitting || !String(value || "").trim()}
          className="inline-flex rounded-lg bg-gradient-to-r from-cyan-300 to-teal-300 p-2 text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          aria-label="Send message"
        >
          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </div>
    </form>
  );
};

export default CommandInput;

