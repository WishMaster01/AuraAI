import axios from "axios";
import moment from "moment";
import { aiConfig } from "../config/aiProviders.js";
import { generateWithGemini } from "./gemini.service.js";
import { generateWithOpenRouter } from "./openrouter.service.js";
import { getRelevantKnowledge } from "./rag.service.js";
import { buildVoiceClassifierPrompt } from "../prompts/voiceClassifier.prompt.js";
import { normalizeAssistantPayload, parseAIJson } from "../utils/validateAIResponse.js";

const INTENT_RULES = [
  {
    intent: "get_time",
    type: "utility",
    route: "chat",
    confidence: 0.99,
    patterns: [/\bwhat(?:'s| is) the time\b/i, /\bcurrent time\b/i, /\btime now\b/i, /^\s*time\s*$/i],
  },
  {
    intent: "get_date",
    type: "utility",
    route: "chat",
    confidence: 0.99,
    patterns: [/\bwhat(?:'s| is) the date\b/i, /\btoday'?s date\b/i, /\bcurrent date\b/i, /^\s*date\s*$/i],
  },
  {
    intent: "get_day",
    type: "utility",
    route: "chat",
    confidence: 0.97,
    patterns: [/\bwhat day is it\b/i, /\bcurrent day\b/i, /\bday of the week\b/i, /^\s*day\s*$/i],
  },
  {
    intent: "get_month",
    type: "utility",
    route: "chat",
    confidence: 0.97,
    patterns: [/\bwhat month is it\b/i, /\bcurrent month\b/i, /^\s*month\s*$/i],
  },
  {
    intent: "summarize_page",
    type: "page_action",
    route: "page",
    confidence: 0.96,
    actions: ["summarize_page"],
    patterns: [/\bsummariz(e|e this|ing)\b/i, /\bsummary\b/i, /\bkey takeaways\b/i, /\btl;dr\b/i],
  },
  {
    intent: "explain_text",
    type: "page_action",
    route: "page",
    confidence: 0.94,
    actions: ["explain_text"],
    patterns: [/\bexplain\b/i, /\bwhat does this mean\b/i, /\bsimplify\b/i],
  },
  {
    intent: "rewrite_text",
    type: "page_action",
    route: "page",
    confidence: 0.94,
    actions: ["rewrite_text"],
    patterns: [/\brewrite\b/i, /\brephrase\b/i, /\bpolish\b/i, /\bmake this sound\b/i],
  },
  {
    intent: "translate_text",
    type: "page_action",
    route: "page",
    confidence: 0.94,
    actions: ["translate_text"],
    patterns: [/\btranslate\b/i, /\bin another language\b/i, /\bconvert to\b/i],
  },
  {
    intent: "generate_reply",
    type: "page_action",
    route: "page",
    confidence: 0.93,
    actions: ["generate_reply"],
    patterns: [/\bdraft a reply\b/i, /\bgenerate reply\b/i, /\bwrite a response\b/i, /\breply to\b/i],
  },
  {
    intent: "save_note",
    type: "page_action",
    route: "page",
    confidence: 0.92,
    actions: ["save_note"],
    patterns: [/\bsave note\b/i, /\btake a note\b/i, /\bsave this\b/i, /\bnote this\b/i],
  },
  {
    intent: "summarize_document",
    type: "page_action",
    route: "page",
    confidence: 0.94,
    actions: ["summarize_page"],
    patterns: [/\bsummarize document\b/i, /\bsummarize article\b/i, /\bsummarize file\b/i, /\bbriefly summarize\b/i],
  },
  {
    intent: "code_explain",
    type: "page_action",
    route: "page",
    confidence: 0.93,
    actions: ["explain_text"],
    patterns: [/\bexplain code\b/i, /\bcode explainer\b/i, /\bwalk me through this code\b/i, /\bdebug this\b/i],
  },
  {
    intent: "draft_email",
    type: "page_action",
    route: "page",
    confidence: 0.93,
    actions: ["generate_reply"],
    patterns: [/\bdraft email\b/i, /\bwrite an email\b/i, /\bcompose email\b/i, /\bemail draft\b/i, /\bemail reply\b/i],
  },
  {
    intent: "meeting_notes",
    type: "page_action",
    route: "page",
    confidence: 0.93,
    actions: ["save_note"],
    patterns: [/\bmeeting notes\b/i, /\bnotes from meeting\b/i, /\bmeeting summary\b/i, /\btranscribe meeting\b/i],
  },
  {
    intent: "brainstorm_ideas",
    type: "page_action",
    route: "page",
    confidence: 0.92,
    actions: ["brainstorm_ideas"],
    patterns: [/\bbrainstorm\b/i, /\bgive me ideas\b/i, /\bidea list\b/i, /\bcreative ideas\b/i],
  },
  {
    intent: "create_todo",
    type: "page_action",
    route: "page",
    confidence: 0.92,
    actions: ["create_todo"],
    patterns: [/\bto-?do\b/i, /\btask list\b/i, /\bchecklist\b/i, /\bturn this into tasks\b/i],
  },
  {
    intent: "extract_action_items",
    type: "page_action",
    route: "page",
    confidence: 0.93,
    actions: ["extract_action_items"],
    patterns: [/\baction items\b/i, /\bextract action items\b/i, /\bnext steps\b/i, /\bdecisions\b/i],
  },
  {
    intent: "compare_options",
    type: "page_action",
    route: "page",
    confidence: 0.91,
    actions: ["compare_options"],
    patterns: [/\bcompare\b/i, /\bpros and cons\b/i, /\bwhich is better\b/i, /\bversus\b/i],
  },
  {
    intent: "generate_title",
    type: "page_action",
    route: "page",
    confidence: 0.91,
    actions: ["generate_title"],
    patterns: [/\bgenerate title\b/i, /\bheadline ideas\b/i, /\bsubject line\b/i, /\btitle ideas\b/i],
  },
  {
    intent: "analyze_text",
    type: "page_action",
    route: "page",
    confidence: 0.91,
    actions: ["analyze_text"],
    patterns: [/\banalyze\b/i, /\btext analysis\b/i, /\bsentiment\b/i, /\binsights\b/i],
  },
  {
    intent: "write_post",
    type: "page_action",
    route: "page",
    confidence: 0.9,
    actions: ["write_post"],
    patterns: [/\bsocial post\b/i, /\blinkedin post\b/i, /\btweet\b/i, /\bcaption\b/i, /\bpost draft\b/i],
  },
  {
    intent: "open_dashboard",
    type: "navigation",
    route: "system",
    confidence: 0.96,
    actions: ["open_dashboard"],
    patterns: [/\bdashboard\b/i, /\bgo to dashboard\b/i, /\bopen dashboard\b/i],
  },
  {
    intent: "open_tools",
    type: "navigation",
    route: "system",
    confidence: 0.96,
    actions: ["open_tools"],
    patterns: [/\btools\b/i, /\bopen tools\b/i, /\bgo to tools\b/i],
  },
  {
    intent: "open_youtube",
    type: "navigation",
    route: "system",
    confidence: 0.98,
    actions: ["open_youtube"],
    patterns: [
      /\bopen youtube\b/i,
      /\bgo to youtube\b/i,
      /\blaunch youtube\b/i,
      /\byoutube\b/i,
    ],
  },
  {
    intent: "open_prompts",
    type: "navigation",
    route: "system",
    confidence: 0.96,
    actions: ["open_prompts"],
    patterns: [/\bprompts\b/i, /\bprompt library\b/i, /\bopen prompts\b/i],
  },
  {
    intent: "open_customize",
    type: "navigation",
    route: "system",
    confidence: 0.94,
    actions: ["open_customize"],
    patterns: [/\bcustomi[sz]e\b/i, /\bassistant image\b/i, /\brename assistant\b/i],
  },
  {
    intent: "open_settings",
    type: "navigation",
    route: "system",
    confidence: 0.94,
    actions: ["open_settings"],
    patterns: [/\bsettings\b/i, /\bpreferences\b/i, /\bconfiguration\b/i],
  },
  {
    intent: "open_about",
    type: "navigation",
    route: "system",
    confidence: 0.9,
    actions: ["open_about"],
    patterns: [/\babout\b/i, /\babout page\b/i],
  },
  {
    intent: "open_contact",
    type: "navigation",
    route: "system",
    confidence: 0.9,
    actions: ["open_contact"],
    patterns: [/\bcontact\b/i, /\bcontact page\b/i, /\breach out\b/i],
  },
  {
    intent: "open_privacy",
    type: "navigation",
    route: "system",
    confidence: 0.9,
    actions: ["open_privacy"],
    patterns: [/\bprivacy\b/i, /\bprivacy policy\b/i],
  },
  {
    intent: "open_legal",
    type: "navigation",
    route: "system",
    confidence: 0.9,
    actions: ["open_legal"],
    patterns: [/\blegal\b/i, /\bterms\b/i, /\bterms of service\b/i],
  },
  {
    intent: "open_assistant",
    type: "navigation",
    route: "system",
    confidence: 0.95,
    actions: ["open_assistant"],
    patterns: [/\bopen assistant\b/i, /\bstart assistant\b/i, /\bcontinue chat\b/i],
  },
  {
    intent: "calculate",
    type: "utility",
    route: "chat",
    confidence: 0.9,
    patterns: [/\bcalculate\b/i, /\bwhat is [\d+\-*/().\s]+\b/i, /\bsolve\b/i, /\bmath\b/i],
  },
];

const normalizeCommand = (command) => String(command || "").trim();

const buildRuleResult = (rule, command) => ({
  type: rule.type,
  intent: rule.intent,
  userInput: command,
  response:
    rule.intent === "get_time"
      ? `Current time is ${moment().format("hh:mm A")}.`
      : rule.intent === "get_date"
        ? `Current date is ${moment().format("YYYY-MM-DD")}.`
        : rule.intent === "get_day"
          ? `Today is ${moment().format("dddd")}.`
          : rule.intent === "get_month"
            ? `Current month is ${moment().format("MMMM")}.`
            : rule.intent === "calculate"
              ? "I can calculate that for you."
              : rule.intent === "summarize_document"
                ? "I’ll summarize the document."
                : rule.intent === "code_explain"
                  ? "I’ll explain the code."
                  : rule.intent === "draft_email"
                    ? "I’ll draft the email."
                    : rule.intent === "meeting_notes"
                      ? "I’ll turn this into meeting notes."
                      : rule.intent === "brainstorm_ideas"
                        ? "I’ll brainstorm ideas."
                        : rule.intent === "create_todo"
                          ? "I’ll turn this into a checklist."
                          : rule.intent === "extract_action_items"
                            ? "I’ll extract the action items."
                            : rule.intent === "compare_options"
                              ? "I’ll compare the options."
                              : rule.intent === "generate_title"
                                ? "I’ll suggest title ideas."
                                : rule.intent === "analyze_text"
                                  ? "I’ll analyze the text."
                                  : rule.intent === "write_post"
                                    ? "I’ll draft the post."
                                    : rule.intent === "open_dashboard"
                                      ? "Opening the dashboard."
                                      : rule.intent === "open_tools"
                                      ? "Opening the tools page."
                                      : rule.intent === "open_youtube"
                                        ? "Opening YouTube."
                                      : rule.intent === "open_prompts"
                                          ? "Opening the prompt library."
                                          : rule.intent === "open_customize"
                                            ? "Opening assistant customization."
                                            : rule.intent === "open_settings"
                                              ? "Opening settings."
                                              : rule.intent === "open_about"
                                                ? "Opening the about page."
                                                : rule.intent === "open_contact"
                                                  ? "Opening the contact page."
                                                  : rule.intent === "open_privacy"
                                                    ? "Opening the privacy policy."
                                                    : rule.intent === "open_legal"
                                                      ? "Opening the legal page."
                                                      : rule.intent === "open_assistant"
                                                        ? "Opening the assistant."
                                                        : `Understood. ${rule.intent.replace(/_/g, " ")}.`,
  route: rule.route,
  confidence: rule.confidence,
  actions: rule.actions || [],
});

const matchRule = (command) => {
  for (const rule of INTENT_RULES) {
    if (rule.patterns.some((pattern) => pattern.test(command))) {
      return buildRuleResult(rule, command);
    }
  }
  return null;
};

const getIntentPrompt = ({ assistantName, userName, command }) =>
  buildVoiceClassifierPrompt({
    assistantName,
    userName,
    command,
    knowledge: getRelevantKnowledge(command, 3),
  });

const tryModelClassification = async ({ assistantName, userName, command }) => {
  const prompt = getIntentPrompt({ assistantName, userName, command });
  const providers = [];

  if (aiConfig.geminiApiKey) {
    providers.push({
      name: "gemini",
      run: () => generateWithGemini({ userPrompt: prompt, temperature: 0.1, maxOutputTokens: 512 }),
    });
  }

  if (aiConfig.openRouterApiKey) {
    providers.push({
      name: "openrouter",
      run: () => generateWithOpenRouter({ userPrompt: prompt, temperature: 0.1 }),
    });
  }

  let lastError = null;
  for (const provider of providers) {
    try {
      const raw = await provider.run();
      const parsed = parseAIJson(raw);
      if (parsed) {
        return normalizeAssistantPayload(parsed, {
          type: "general",
          intent: "general",
          userInput: command,
          response: "Understood.",
          route: "chat",
          confidence: 0.6,
        });
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

const tryPythonIntentService = async (command) => {
  if (!aiConfig.intentServiceUrl) return null;

  try {
    const response = await axios.post(
      aiConfig.intentServiceUrl,
      { command },
      { timeout: 5000 }
    );
    const payload = response.data || {};
    const confidence = Number(payload.confidence ?? payload.score ?? 0);
    if (confidence >= 0.85 && (payload.intent || payload.type)) {
      return normalizeAssistantPayload({
        type: payload.type || "general",
        intent: payload.intent || payload.type || "general",
        userInput: payload.userInput || command,
        response: payload.response || "",
        route: payload.route || "chat",
        confidence,
        actions: payload.actions || [],
        sources: payload.sources || [],
      });
    }
  } catch {
    return null;
  }

  return null;
};

export const classifyAssistantCommand = async ({
  assistantName = "AuraAI",
  userName = "User",
  command = "",
}) => {
  const cleanCommand = normalizeCommand(command);

  if (!cleanCommand) {
    return {
      type: "general",
      intent: "general",
      userInput: "",
      response: "Please enter a command.",
      route: "chat",
      confidence: 0,
      actions: [],
    };
  }

  const pythonResult = await tryPythonIntentService(cleanCommand);
  if (pythonResult) {
    return pythonResult;
  }

  const ruleResult = matchRule(cleanCommand);
  if (ruleResult) {
    return ruleResult;
  }

  try {
    const modelResult = await tryModelClassification({
      assistantName,
      userName,
      command: cleanCommand,
    });

    if (modelResult) {
      return modelResult;
    }
  } catch {
    // Fall through to generic classification.
  }

  return {
    type: "general",
    intent: "general",
    userInput: cleanCommand,
    response: "Understood.",
    route: "chat",
    confidence: 0.45,
    actions: [],
  };
};
