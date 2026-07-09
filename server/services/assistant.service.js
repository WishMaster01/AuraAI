import moment from "moment";
import { aiConfig } from "../config/aiProviders.js";
import { generateWithGemini } from "./gemini.service.js";
import { generateWithOpenRouter } from "./openrouter.service.js";
import { classifyAssistantCommand } from "./intentClassifier.service.js";
import { getRelevantKnowledge } from "./rag.service.js";
import { buildChatAssistantPrompt } from "../prompts/chatAssistant.prompt.js";
import { buildPageAssistantPrompt } from "../prompts/pageAssistant.prompt.js";
import { normalizeAssistantPayload, parseAIJson } from "../utils/validateAIResponse.js";

const TRANSFORM_INTENTS = new Set([
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
]);

const extractSourceText = ({ intent, command = "", pageContext = {} }) => {
  const pageSource = String(
    pageContext.selectedText || pageContext.pageText || ""
  ).trim();
  if (pageSource) return pageSource.slice(0, 4000);

  const text = String(command || "").trim();
  if (!text || !TRANSFORM_INTENTS.has(intent)) return "";

  const prefixMatchers = {
    rewrite_text: [/^rewrite(?:\s+this)?(?:\s+text)?(?:\s+in\b.*)?\s*[:\-–—]\s*/i, /^rewrite(?:\s+this)?(?:\s+text)?(?:\s+in\b.*)?\s+/i],
    translate_text: [/^translate(?:\s+this)?(?:\s+text)?(?:\s+to\b.*)?\s*[:\-–—]\s*/i, /^translate(?:\s+this)?(?:\s+text)?(?:\s+to\b.*)?\s+/i],
    summarize_page: [/^summarize(?:\s+this)?(?:\s+page)?\s*[:\-–—]\s*/i, /^summarize(?:\s+this)?(?:\s+page)?\s+/i],
    summarize_document: [/^summarize(?:\s+this)?(?:\s+document|article|file)?\s*[:\-–—]\s*/i, /^summarize(?:\s+this)?(?:\s+document|article|file)?\s+/i],
    explain_text: [/^explain(?:\s+this)?(?:\s+text)?\s*[:\-–—]\s*/i, /^explain(?:\s+this)?(?:\s+text)?\s+/i],
    code_explain: [/^explain(?:\s+this)?(?:\s+code)?\s*[:\-–—]\s*/i, /^code explainer\s*[:\-–—]\s*/i],
    generate_reply: [/^generate(?:\s+a)? reply\s*[:\-–—]\s*/i, /^draft(?:\s+a)? reply\s*[:\-–—]\s*/i, /^write a response\s*[:\-–—]\s*/i],
    draft_email: [/^draft(?:\s+an)? email\s*[:\-–—]\s*/i, /^write an email\s*[:\-–—]\s*/i, /^compose email\s*[:\-–—]\s*/i],
    meeting_notes: [/^meeting notes?\s*[:\-–—]\s*/i, /^create meeting notes\s*[:\-–—]\s*/i],
    brainstorm_ideas: [/^brainstorm(?:\s+ideas)?\s*[:\-–—]\s*/i, /^give me ideas\s*[:\-–—]\s*/i],
    create_todo: [/^(?:create\s+)?(?:to-?do|task list|checklist)\s*[:\-–—]\s*/i],
    extract_action_items: [/^extract action items\s*[:\-–—]\s*/i, /^action items\s*[:\-–—]\s*/i],
    compare_options: [/^compare(?:\s+these)?(?:\s+options)?\s*[:\-–—]\s*/i],
    generate_title: [/^generate(?:\s+a)? title\s*[:\-–—]\s*/i, /^title ideas\s*[:\-–—]\s*/i, /^headline ideas\s*[:\-–—]\s*/i, /^subject line\s*[:\-–—]\s*/i],
    analyze_text: [/^analyze(?:\s+this)?(?:\s+text)?\s*[:\-–—]\s*/i, /^text analysis\s*[:\-–—]\s*/i],
    write_post: [/^write(?:\s+a)?(?:\s+linkedin)?(?:\s+social)?\s+post\s*[:\-–—]\s*/i, /^post draft\s*[:\-–—]\s*/i, /^tweet\s*[:\-–—]\s*/i, /^caption\s*[:\-–—]\s*/i],
  };

  for (const pattern of prefixMatchers[intent] || []) {
    if (pattern.test(text)) {
      const candidate = text.replace(pattern, "").trim();
      return candidate ? candidate.slice(0, 4000) : "";
    }
  }

  const colonIndex = text.indexOf(":");
  if (colonIndex !== -1) {
    const candidate = text.slice(colonIndex + 1).trim();
    return candidate ? candidate.slice(0, 4000) : "";
  }

  return "";
};

const buildFallbackResponse = ({
  classification,
  command,
  pageContext,
  sourceText = "",
}) => {
  const intent = classification.intent || "general";

  if (intent === "open_dashboard") return "Opening the dashboard.";
  if (intent === "open_tools") return "Opening the tools page.";
  if (intent === "open_youtube") return "Opening YouTube.";
  if (intent === "open_prompts") return "Opening the prompt library.";
  if (intent === "open_customize") return "Opening assistant customization.";
  if (intent === "open_settings") return "Opening settings.";
  if (intent === "open_about") return "Opening the about page.";
  if (intent === "open_contact") return "Opening the contact page.";
  if (intent === "open_privacy") return "Opening the privacy policy.";
  if (intent === "open_legal") return "Opening the legal page.";
  if (
    intent === "summarize_page" ||
    intent === "summarize_document" ||
    intent === "explain_text" ||
    intent === "code_explain" ||
    intent === "rewrite_text" ||
    intent === "translate_text" ||
    intent === "generate_reply"
  ) {
    if (!sourceText) {
      return intent === "rewrite_text"
        ? "Paste the text you want rewritten after the command, and I’ll transform it."
        : intent === "translate_text"
          ? "Paste the text you want translated after the command, and I’ll translate it."
          : "Share the page text or selected text and I can process it.";
    }
    if (intent === "rewrite_text") {
      return "I received the text, but the rewrite response could not be generated right now.";
    }
    if (intent === "translate_text") {
      return "I received the text, but the translation response could not be generated right now.";
    }
    return "I received the text, but the response could not be generated right now.";
  }

  if (intent === "calculate") return "Share the expression and I’ll calculate it.";
  if (intent === "brainstorm_ideas") return "Share the topic and I’ll generate ideas.";
  if (intent === "draft_email") return "Share the recipient, tone, and key points.";
  if (intent === "meeting_notes") return "Share the notes or transcript and I’ll format it.";
  if (intent === "create_todo") return "Share the tasks and I’ll turn them into a checklist.";
  if (intent === "code_explain") return "Share the code and I’ll explain it step by step.";
  if (intent === "extract_action_items") return "Share the notes and I’ll extract action items.";
  if (intent === "compare_options") return "Share the options and I’ll compare them.";
  if (intent === "generate_title") return "Share the topic and I’ll suggest titles.";
  if (intent === "analyze_text") return "Share the text and I’ll analyze it.";
  if (intent === "write_post") return "Share the topic and I’ll draft a post.";

  return `I'm ready to help with "${command}".`;
};

const createPromptContext = ({
  assistantName,
  userName,
  command,
  classification,
  pageContext,
  sourceText,
  knowledge,
  historySummary,
}) => {
  if (pageContext && Object.keys(pageContext).length > 0) {
    return buildPageAssistantPrompt({
      assistantName,
      userName,
      command,
      pageContext,
      sourceText,
      knowledge,
    });
  }

  return buildChatAssistantPrompt({
    assistantName,
    userName,
    command,
    intent: classification.intent,
    sourceText,
    knowledge,
    historySummary,
  });
};

const tryProviders = async ({ systemInstruction, userPrompt }) => {
  const providers = [];

  if (aiConfig.geminiApiKey) {
    providers.push({
      name: "gemini",
      run: () =>
        generateWithGemini({
          systemInstruction,
          userPrompt,
          temperature: aiConfig.temperature,
          maxOutputTokens: 1024,
        }),
    });
  }

  if (aiConfig.openRouterApiKey) {
    providers.push({
      name: "openrouter",
      run: () =>
        generateWithOpenRouter({
          systemInstruction,
          userPrompt,
          temperature: aiConfig.temperature,
        }),
    });
  }

  let lastError = null;
  for (const provider of providers) {
    try {
      const raw = await provider.run();
      const parsed = parseAIJson(raw);
      if (parsed) {
        return { provider: provider.name, raw, parsed };
      }
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError) {
    throw lastError;
  }

  return null;
};

const buildDeterministicReply = (classification) => {
  const intent = classification.intent || "general";
  const response =
    intent === "get_time"
      ? `Current time is ${moment().format("hh:mm A")}.`
      : intent === "get_date"
        ? `Current date is ${moment().format("YYYY-MM-DD")}.`
        : intent === "get_day"
          ? `Today is ${moment().format("dddd")}.`
          : intent === "get_month"
            ? `Current month is ${moment().format("MMMM")}.`
            : null;

  if (!response) {
    return null;
  }

  return normalizeAssistantPayload(
    {
      type: classification.type || "utility",
      intent,
      userInput: classification.userInput,
      response,
      route: classification.route || "chat",
      confidence: 1,
      actions: classification.actions || [],
    },
    classification
  );
};

export const generateAssistantReply = async ({
  assistantName = "AuraAI",
  userName = "User",
  command = "",
  pageContext = {},
  historySummary = "",
}) => {
  const cleanCommand = String(command || "").trim();
  const classification = await classifyAssistantCommand({
    assistantName,
    userName,
    command: cleanCommand,
  });
  const sourceText = extractSourceText({
    intent: classification.intent,
    command: cleanCommand,
    pageContext,
  });

  const deterministic = buildDeterministicReply(classification);
  if (deterministic) {
    return deterministic;
  }

  if (
    [
      "rewrite_text",
      "translate_text",
      "summarize_page",
      "summarize_document",
      "explain_text",
      "code_explain",
      "meeting_notes",
      "extract_action_items",
      "analyze_text",
    ].includes(
      classification.intent
    ) &&
    !sourceText
  ) {
    return normalizeAssistantPayload(
      {
        type: classification.type || "page_action",
        intent: classification.intent || "general",
        userInput: cleanCommand,
        response: buildFallbackResponse({
          classification,
          command: cleanCommand,
          pageContext,
          sourceText,
        }),
        route: classification.route || "chat",
        confidence: classification.confidence || 0.45,
        actions: classification.actions || [],
        sources: [],
      },
      classification
    );
  }

  const knowledge = getRelevantKnowledge(cleanCommand, 4);
  const systemInstruction = createPromptContext({
    assistantName,
    userName,
    command: cleanCommand,
    classification,
    pageContext,
    sourceText,
    knowledge,
    historySummary,
  });

  try {
    const result = await tryProviders({
      systemInstruction,
      userPrompt: cleanCommand,
    });

    const normalized = normalizeAssistantPayload(result?.parsed, {
      type: classification.type || "general",
      intent: classification.intent || "general",
      userInput: cleanCommand,
      response: buildFallbackResponse({
        classification,
        command: cleanCommand,
        pageContext,
        sourceText,
      }),
      route: classification.route || "chat",
      confidence: classification.confidence || 0.55,
      actions: classification.actions || [],
      sources: knowledge.map((item) => ({
        title: item.title,
        source: item.source,
        snippet: item.snippet.slice(0, 280),
      })),
    });

    if (!normalized.response) {
      normalized.response = buildFallbackResponse({
        classification,
        command: cleanCommand,
        pageContext,
        sourceText,
      });
    }

    if (!normalized.sources.length) {
      normalized.sources = knowledge.map((item) => ({
        title: item.title,
        source: item.source,
        snippet: item.snippet.slice(0, 280),
      }));
    }

    return normalized;
  } catch {
    return normalizeAssistantPayload(
      {
        type: classification.type || "general",
        intent: classification.intent || "general",
        userInput: cleanCommand,
        response: buildFallbackResponse({
          classification,
          command: cleanCommand,
          pageContext,
          sourceText,
        }),
        route: classification.route || "chat",
        confidence: classification.confidence || 0.45,
        actions: classification.actions || [],
        sources: knowledge.map((item) => ({
          title: item.title,
          source: item.source,
          snippet: item.snippet.slice(0, 280),
        })),
      },
      classification
    );
  }
};
