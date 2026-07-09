const stripCodeFence = (value) => {
  const text = String(value || "").trim();
  if (!text.startsWith("```")) return text;

  return text.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
};

const extractCandidate = (value) => {
  const text = stripCodeFence(value);
  const candidates = [text];

  const firstObject = text.indexOf("{");
  const lastObject = text.lastIndexOf("}");
  if (firstObject !== -1 && lastObject !== -1 && lastObject > firstObject) {
    candidates.push(text.slice(firstObject, lastObject + 1));
  }

  const firstArray = text.indexOf("[");
  const lastArray = text.lastIndexOf("]");
  if (firstArray !== -1 && lastArray !== -1 && lastArray > firstArray) {
    candidates.push(text.slice(firstArray, lastArray + 1));
  }

  return candidates;
};

export const parseAIJson = (value) => {
  if (value && typeof value === "object") {
    return value;
  }

  if (typeof value !== "string") {
    return null;
  }

  for (const candidate of extractCandidate(value)) {
    try {
      return JSON.parse(candidate);
    } catch {
      continue;
    }
  }

  return null;
};

export const normalizeAssistantPayload = (payload, fallback = {}) => {
  const safePayload = payload && typeof payload === "object" ? payload : {};
  const response = String(safePayload.response ?? fallback.response ?? "").trim();
  const userInput = String(
    safePayload.userInput ?? fallback.userInput ?? ""
  ).trim();
  const intent = String(
    safePayload.intent ?? fallback.intent ?? safePayload.type ?? "general"
  ).trim() || "general";
  const type = String(
    safePayload.type ?? fallback.type ?? intent ?? "general"
  ).trim() || "general";

  return {
    type,
    intent,
    userInput,
    response,
    route: String(safePayload.route ?? fallback.route ?? "chat").trim() || "chat",
    confidence: Number.isFinite(Number(safePayload.confidence))
      ? Math.max(0, Math.min(1, Number(safePayload.confidence)))
      : Number.isFinite(Number(fallback.confidence))
        ? Math.max(0, Math.min(1, Number(fallback.confidence)))
        : 0.5,
    actions: Array.isArray(safePayload.actions)
      ? safePayload.actions.filter(Boolean)
      : Array.isArray(fallback.actions)
        ? fallback.actions.filter(Boolean)
        : [],
    sources: Array.isArray(safePayload.sources)
      ? safePayload.sources
      : Array.isArray(fallback.sources)
        ? fallback.sources
        : [],
    notes: Array.isArray(safePayload.notes)
      ? safePayload.notes.filter(Boolean)
      : [],
    metadata:
      safePayload.metadata && typeof safePayload.metadata === "object"
        ? safePayload.metadata
        : fallback.metadata && typeof fallback.metadata === "object"
          ? fallback.metadata
          : {},
  };
};

