import { randomUUID } from "node:crypto";

const requestLogger = (req, res, next) => {
  const requestId = req.get("x-request-id") || randomUUID();
  const startedAt = process.hrtime.bigint();
  let logged = false;

  req.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);

  const logRequest = (phase) => {
    if (logged) return;
    logged = true;

    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1e6;
    const userTag = req.userId ? ` user=${req.userId}` : "";
    const originTag = req.headers.origin ? ` origin=${req.headers.origin}` : "";

    console.info(
      `[${new Date().toISOString()}] ${phase} ${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs.toFixed(1)}ms id=${requestId}${userTag}${originTag}`
    );
  };

  res.on("finish", () => logRequest("done"));
  res.on("close", () => {
    if (!res.writableEnded) {
      logRequest("aborted");
    }
  });

  next();
};

export default requestLogger;

