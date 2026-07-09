import React from "react";

const renderInline = (text) => {
  const safe = text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
  return safe
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`(.+?)`/g, "<code class='rounded bg-black/35 px-1.5 py-0.5 text-[0.95em] text-cyan-100'>$1</code>");
};

const MarkdownMessage = ({ content }) => {
  const blocks = String(content || "").split("```");

  return (
    <div className="space-y-2">
      {blocks.map((block, idx) => {
        if (idx % 2 === 1) {
          const lines = block.split("\n");
          const lang = lines[0]?.trim() || "code";
          const code = lines.slice(1).join("\n");
          const handleCopy = async () => {
            try {
              await navigator.clipboard.writeText(code);
            } catch (error) {
              console.error("Copy failed:", error);
            }
          };

          return (
            <div key={`${lang}-${idx}`} className="overflow-hidden rounded-lg border border-white/10 bg-slate-950/70">
              <div className="flex items-center justify-between border-b border-white/10 px-3 py-2 text-xs font-semibold text-slate-400">
                <span>{lang}</span>
                <button type="button" onClick={handleCopy} className="rounded-lg border border-white/10 px-2 py-1 text-xs text-slate-300 transition hover:bg-white/10" aria-label="Copy code">
                  Copy
                </button>
              </div>
              <pre className="aura-scrollbar overflow-x-auto bg-transparent p-3 text-sm text-cyan-50" aria-label={`Code block (${lang})`}>
                <code>{code}</code>
              </pre>
            </div>
          );
        }
        return (
          <p key={`text-${idx}`} className="whitespace-pre-wrap leading-relaxed" dangerouslySetInnerHTML={{ __html: renderInline(block) }} />
        );
      })}
    </div>
  );
};

export default MarkdownMessage;
