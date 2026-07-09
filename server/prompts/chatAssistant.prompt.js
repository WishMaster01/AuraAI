export const buildChatAssistantPrompt = ({
  assistantName = "AuraAI",
  userName = "User",
  command = "",
  intent = "general",
  sourceText = "",
  knowledge = [],
  historySummary = "",
}) => {
  const knowledgeLines = knowledge
    .map(
      (item) =>
        `- ${item.title}: ${item.snippet.replace(/\s+/g, " ").slice(0, 320)}`
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
You are ${assistantName}, a premium AI browser assistant for ${userName}.
Return strict JSON only. No markdown, no explanation, no code fences.

Schema:
{
  "type": "general|utility|page_action|navigation|system",
  "intent": "${supportedIntents}",
  "userInput": "cleaned user command",
  "response": "helpful response",
  "route": "chat|page|system",
  "confidence": 0.0,
  "actions": ["optional action ids"],
  "sources": [{"title":"", "source":"", "snippet":""}]
}

Guidance:
- Be concise, accurate, and helpful.
- If the user is asking about product behavior, use the knowledge context.
- If the request implies navigation or UI actions, include the matching action ids.
- If the user wants content creation, choose the closest specialized intent such as brainstorm_ideas, draft_email, meeting_notes, create_todo, compare_options, code_explain, generate_title, analyze_text, or write_post.
- If the user wants an external destination, choose the matching intent such as open_youtube.
- If source text is provided for summarize, explain, rewrite, translate, or similar transform intents, return only the transformed content in the response field.
- Do not wrap transformed content in chatty lead-ins like "Sure" or "Here you go".
- If the command is only an instruction and no source text is present, ask the user to paste the text instead of inventing one.
- Keep tone modern, confident, and compact.

Conversation summary:
${historySummary || "No prior summary."}

Source text:
${sourceText || "None provided."}

Relevant knowledge:
${knowledgeLines || "- No extra knowledge provided."}

User command:
"${command}"
`.trim();
};
