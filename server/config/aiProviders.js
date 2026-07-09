const parseNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const aiConfig = {
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  geminiModel: process.env.GEMINI_MODEL || "gemini-2.0-flash",
  openRouterApiKey: process.env.OPENROUTER_API_KEY || "",
  openRouterModel: process.env.OPENROUTER_MODEL || "deepseek/deepseek-chat",
  temperature: parseNumber(process.env.AI_TEMPERATURE, 0.2),
  intentServiceUrl: process.env.INTENT_SERVICE_URL || "",
  openRouterReferer: process.env.OPENROUTER_HTTP_REFERER || "http://localhost:5173",
  appTitle: process.env.APP_TITLE || "AuraAI",
};

export const hasGemini = Boolean(aiConfig.geminiApiKey);
export const hasOpenRouter = Boolean(aiConfig.openRouterApiKey);

