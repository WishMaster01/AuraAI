const DEFAULT_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"];

const normalizeOrigin = (value) => String(value || "").trim().replace(/\/$/, "");

export const getAllowedOrigins = () => {
  const raw = process.env.CLIENT_ORIGINS || process.env.CLIENT_ORIGIN || "";
  const origins = raw
    .split(",")
    .map(normalizeOrigin)
    .filter(Boolean);

  return origins.length > 0 ? origins : DEFAULT_ORIGINS;
};

export const isAllowedOrigin = (origin) => {
  if (!origin) return true;

  const normalizedOrigin = normalizeOrigin(origin);
  return getAllowedOrigins().some((allowed) => normalizeOrigin(allowed) === normalizedOrigin);
};

