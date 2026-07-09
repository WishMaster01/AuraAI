export const buildVoiceClassifierPrompt = ({
  assistantName = "AuraAI",
  userName = "User",
  command = "",
  knowledge = [],
}) => {
  const knowledgeLines = knowledge
    .map(
      (item) =>
        `- ${item.title}: ${item.snippet.replace(/\s+/g, " ").slice(0, 260)}`
    )
    .join("\n");

  const supportedIntents = [
    "general",
    "get_time",
    "get_date",
    "get_day",
    "get_month",
    "calculate",
    "summarize_page",
    "summarize_document",
    "explain_text",
    "code_explain",
    "rewrite_text",
    "translate_text",
    "generate_reply",
    "draft_email",
    "meeting_notes",
    "brainstorm_ideas",
    "create_todo",
    "extract_action_items",
    "compare_options",
    "generate_title",
    "analyze_text",
    "write_post",
    "save_note",
    "open_dashboard",
    "open_tools",
    "open_youtube",
    "open_prompts",
    "open_customize",
    "open_settings",
    "open_about",
    "open_contact",
    "open_privacy",
    "open_legal",
    "open_assistant",
  ].join("|");

  return `
You are the intent router for ${assistantName}, a premium Chrome assistant for ${userName}.
Return strict JSON only. No markdown, no explanation, no code fences.

Schema:
{
  "type": "general|utility|page_action|navigation|system",
  "intent": "${supportedIntents}",
  "userInput": "cleaned user command",
  "response": "short spoken reply",
  "route": "chat|page|system",
  "confidence": 0.0,
  "actions": ["optional action ids"]
}

Routing rules:
- Use "utility" for time, date, day, month, or calculator style requests.
- Use "page_action" when the user wants to summarize, explain, rewrite, translate, draft, brainstorm, compare, create tasks, take notes, analyze text, or extract action items from page or selected text.
- Use "navigation" for opening dashboard, tools, YouTube, prompts, customize, settings, assistant, about, contact, privacy, or legal screens.
- Use "system" for browser-control style commands.
- Default to "general" when uncertain.
- Keep userInput short and remove filler words.
- response should be concise and natural.

Relevant knowledge:
${knowledgeLines || "- No extra knowledge provided."}

User command:
"${command}"
`.trim();
};
