import axios from "axios";
import { aiConfig, hasGemini } from "../config/aiProviders.js";

export const generateWithGemini = async ({
  systemInstruction = "",
  userPrompt = "",
  temperature = aiConfig.temperature,
  maxOutputTokens = 1024,
}) => {
  if (!hasGemini) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${aiConfig.geminiModel}:generateContent?key=${aiConfig.geminiApiKey}`;
  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: userPrompt }],
      },
    ],
    generationConfig: {
      temperature,
      maxOutputTokens,
      responseMimeType: "application/json",
    },
  };

  if (systemInstruction.trim()) {
    payload.systemInstruction = {
      parts: [{ text: systemInstruction }],
    };
  }

  const response = await axios.post(url, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  const text =
    response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  return text;
};

