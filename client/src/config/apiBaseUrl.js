const FALLBACK_PRODUCTION_API_URL = "https://auraai-wishmaster01.onrender.com";

export const getApiBaseUrl = () => {
  const envUrl = String(import.meta.env.VITE_SERVER_URL || "").trim().replace(/\/$/, "");
  if (envUrl) {
    return envUrl;
  }

  if (import.meta.env.DEV) {
    return "http://localhost:3002";
  }

  return FALLBACK_PRODUCTION_API_URL;
};

