import axios from "axios";
import { aiConfig, hasOpenRouter } from "../config/aiProviders.js";

export const generateWithOpenRouter = async ({
  systemInstruction = "",
  userPrompt = "",
  temperature = aiConfig.temperature,
  model = aiConfig.openRouterModel,
}) => {
  if (!hasOpenRouter) {
    throw new Error("OPENROUTER_API_KEY is not configured.");
  }

  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model,
      temperature,
      messages: [
        ...(systemInstruction.trim()
          ? [{ role: "system", content: systemInstruction }]
          : []),
        { role: "user", content: userPrompt },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${aiConfig.openRouterApiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": aiConfig.openRouterReferer,
        "X-Title": aiConfig.appTitle,
      },
    }
  );

  const text =
    response.data?.choices?.[0]?.message?.content?.trim() || "";

  if (!text) {
    throw new Error("OpenRouter returned an empty response.");
  }

  return text;
};

