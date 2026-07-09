export const buildPageAssistantPrompt = ({
  assistantName = "AuraAI",
  userName = "User",
  command = "",
  pageContext = {},
  sourceText = "",
  knowledge = [],
}) => {
  const knowledgeLines = knowledge
    .map(
      (item) =>
        `- ${item.title}: ${item.snippet.replace(/\s+/g, " ").slice(0, 280)}`
    )
    .join("\n");

  const supportedIntents = [
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
  ].join("|");

  const pageText = String(pageContext.pageText || "").slice(0, 4000);
  const selectedText = String(pageContext.selectedText || "").slice(0, 1500);
  const pageTitle = String(pageContext.pageTitle || "").trim();
  const pageUrl = String(pageContext.pageUrl || "").trim();

  return `
You are ${assistantName}, helping ${userName} work with visible page content.
Return strict JSON only. No markdown, no explanation, no code fences.

Schema:
{
  "type": "page_action",
  "intent": "${supportedIntents}",
  "userInput": "cleaned user command",
  "response": "ready-to-show answer",
  "route": "page",
  "confidence": 0.0,
  "actions": ["summarize_page", "summarize_document", "explain_text", "code_explain", "rewrite_text", "translate_text", "generate_reply", "draft_email", "meeting_notes", "brainstorm_ideas", "create_todo", "extract_action_items", "compare_options", "generate_title", "analyze_text", "write_post", "save_note"],
  "sources": [{"title":"", "source":"", "snippet":""}]
}

Rules:
- Use the page content only if it is present.
- Summaries should be concise and structured.
- Rewrites and translations should preserve meaning.
- Reply drafts should sound usable in an email or chat box.
- For brainstorming, task lists, comparisons, titles, meeting notes, or post drafts, use the page content to extract the strongest usable output.
- If the page context is missing, ask for the page text or selected text.
- If source text is available for a transform intent, return only the transformed content in response.
- Do not add a generic chat preamble when rewriting or translating text.
- If the user asks for a transform but no source text is available, ask for the text to process.

Page title: ${pageTitle || "Untitled page"}
Page URL: ${pageUrl || "Not provided"}

Selected text:
${selectedText || "None provided."}

Page text:
${pageText || "None provided."}

Source text:
${sourceText || "None provided."}

Relevant knowledge:
${knowledgeLines || "- No extra knowledge provided."}

User command:
"${command}"
`.trim();
};
