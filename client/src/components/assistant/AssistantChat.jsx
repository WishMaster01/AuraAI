import { useEffect, useRef } from "react";
import { Bot, User } from "lucide-react";
import MarkdownMessage from "../MarkdownMessage.jsx";

const typingDots = ["", "delay-150", "delay-300"];

const AssistantChat = ({
  messages = [],
  isTyping = false,
  assistantAvatar,
  userInitial = "U",
  emptyTitle = "Ready for a command.",
  emptyDescription = "Ask a question, use voice input, or start with a quick action chip above.",
}) => {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isTyping]);

  return (
    <main
      className="aura-scrollbar flex-1 space-y-4 overflow-y-auto p-3 sm:p-4"
      role="log"
      aria-live="polite"
    >
      {messages.length === 0 && !isTyping && (
        <div className="aura-card animate-aura-fade-up p-4 text-slate-300">
          <p className="font-semibold text-cyan-100">{emptyTitle}</p>
          <p className="mt-1 text-sm text-slate-400">{emptyDescription}</p>
        </div>
      )}

      {isTyping && (
        <div className="flex max-w-[82%] items-center gap-3 rounded-lg border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-slate-300 sm:max-w-[70%]">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-300/10 text-cyan-200">
            <Bot size={16} />
          </span>
          <span className="inline-flex items-center gap-1.5" aria-label="Assistant is typing">
            {typingDots.map((delay) => (
              <span
                key={delay}
                className={`inline-flex h-2 w-2 animate-pulse rounded-full bg-cyan-300 ${delay}`}
              />
            ))}
          </span>
        </div>
      )}

      {messages.map((message, index) => (
        <div
          key={`${message.role}-${index}`}
          className={`animate-aura-fade-up flex gap-3 ${
            message.role === "assistant" ? "justify-start" : "justify-end"
          }`}
        >
          {message.role === "assistant" && (
            <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-cyan-300/30 bg-cyan-300/10 text-cyan-200">
              {assistantAvatar ? (
                <img src={assistantAvatar} alt="" className="h-full w-full object-cover" />
              ) : (
                <Bot size={16} />
              )}
            </span>
          )}

          <div
            className={`max-w-[88%] rounded-lg px-4 py-3 text-sm leading-6 sm:max-w-[76%] ${
              message.role === "assistant"
                ? "border border-white/10 bg-white/[0.07] text-slate-100"
                : "bg-gradient-to-r from-cyan-300 to-teal-300 font-medium text-slate-950 shadow-[0_14px_34px_rgba(34,211,238,0.16)]"
            }`}
          >
            <MarkdownMessage content={message.content} />
          </div>

          {message.role !== "assistant" && (
            <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.08] text-xs font-bold text-slate-100">
              {userInitial || <User size={15} />}
            </span>
          )}
        </div>
      ))}

      <div ref={endRef} />
    </main>
  );
};

export default AssistantChat;

