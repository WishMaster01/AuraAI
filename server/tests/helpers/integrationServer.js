import http from "node:http";

export const hasDatabaseUrl = Boolean(process.env.TEST_DATABASE_URL);

if (process.env.TEST_DATABASE_URL) {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
}

export const createIntegrationServer = async () => {
  if (!hasDatabaseUrl) return null;

  const { default: app } = await import("../../server.js");
  const server = http.createServer(app);

  await new Promise((resolve) => {
    server.listen(0, resolve);
  });

  const address = server.address();
  const baseUrl =
    typeof address === "object" && address
      ? `http://127.0.0.1:${address.port}`
      : "http://127.0.0.1:3000";

  return { server, baseUrl };
};

export const closeIntegrationServer = async (server) => {
  if (!server) return;

  await new Promise((resolve) => {
    server.close(resolve);
  });
};

export const jsonRequest = async (baseUrl, path, options = {}) => {
  const response = await fetch(`${baseUrl}${path}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
  }

  return { response, data };
};

export const getCookieHeader = (response) => {
  const rawCookies =
    response.headers.getSetCookie?.() ||
    (response.headers.get("set-cookie")
      ? [response.headers.get("set-cookie")]
      : []);

  return rawCookies
    .map((value) => String(value).split(";")[0])
    .filter(Boolean)
    .join("; ");
};
