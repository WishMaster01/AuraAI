import axios from "axios";
import { getApiBaseUrl } from "../config/apiBaseUrl.js";

const createFallbackClient = () =>
  axios.create({
    baseURL: getApiBaseUrl(),
    withCredentials: true,
  });

const isLegacyFallbackable = (error) =>
  [404, 405].includes(error?.response?.status);

const getClient = (api) => api || createFallbackClient();

const buildFallbackResponse = (command, message) => ({
  type: "general",
  intent: "general",
  userInput: String(command || ""),
  response: message,
  route: "chat",
  confidence: 0.3,
  actions: [],
});

export const requestAssistantReply = async ({
  api,
  command,
  assistantName,
  userName,
  pageContext = null,
  historySummary = "",
  allowLegacyFallback = true,
}) => {
  const client = getClient(api);
  const payload = {
    command,
    assistantName,
    userName,
    pageContext,
    historySummary,
  };

  try {
    const response = await client.post("/api/assistant/respond", payload);
    return response.data;
  } catch (error) {
    if (allowLegacyFallback && isLegacyFallbackable(error)) {
      try {
        const legacyResponse = await client.post(
          "/api/user/asktoassistant",
          payload,
        );
        return legacyResponse.data;
      } catch (legacyError) {
        return buildFallbackResponse(
          command,
          legacyError.response?.data?.response ||
            "Sorry, I couldn't process that right now.",
        );
      }
    }

    return buildFallbackResponse(
      command,
      error.response?.data?.response ||
        "Sorry, I couldn't process that right now.",
    );
  }
};

export const requestAssistantClassification = async ({
  api,
  command,
  assistantName,
  userName,
}) => {
  const client = getClient(api);
  try {
    const response = await client.post("/api/assistant/classify", {
      command,
      assistantName,
      userName,
    });
    return response.data;
  } catch (error) {
    if (isLegacyFallbackable(error)) {
      return buildFallbackResponse(
        command,
        error.response?.data?.response || "Unable to classify command.",
      );
    }
    return buildFallbackResponse(
      command,
      error.response?.data?.response || "Unable to classify command.",
    );
  }
};
