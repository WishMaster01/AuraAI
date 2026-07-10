import dotenv from "dotenv";
dotenv.config();

import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

import connectDB from "./configs/db.js";
import { getAllowedOrigins, isAllowedOrigin } from "./configs/origins.js";
import authRouter from "./routes/auth.routes.js";
import assistantRouter from "./routes/assistant.routes.js";
import userRouter from "./routes/user.routes.js";
import corsGuard from "./middlewares/corsGuard.js";
import requestLogger from "./middlewares/requestLogger.js";
import securityHeaders from "./middlewares/securityHeaders.js";
import geminiResponse from "./gemini.js";

const app = express();
const PORT = process.env.PORT || 3000;
const apiHits = new Map();
const isDirectRun =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

const corsOptions = {
  origin(origin, cb) {
    cb(null, !origin || isAllowedOrigin(origin));
  },
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "X-Request-Id"],
  exposedHeaders: ["X-Request-Id"],
  credentials: true,
  maxAge: 86400,
  optionsSuccessStatus: 204,
};

// Middleware
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());
app.set("trust proxy", 1);
app.use(requestLogger);
app.use(clerkMiddleware());
app.use(corsGuard);
app.use(cors(corsOptions));
app.disable("x-powered-by");
app.use(securityHeaders);
app.use((req, res, next) => {
  const key = req.ip || "unknown";
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 120;
  const bucket = apiHits.get(key) || [];
  const recent = bucket.filter((t) => now - t < windowMs);
  recent.push(now);
  apiHits.set(key, recent);
  if (recent.length > maxRequests) {
    return res.status(429).json({ message: "Too many requests, try later." });
  }
  return next();
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/assistant", assistantRouter);
app.use("/api/user", userRouter);

// Root route
app.get("/", async (req, res) => {
  try {
    let prompt = req.query.prompt;
    if (!prompt) {
      return res.status(400).json({ message: "Prompt parameter is required" });
    }
    const data = await geminiResponse(prompt);
    res.json(data);
  } catch (error) {
    console.error("Root route error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is running", status: "OK" });
});

// 404 handler - must be last
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  if (res.headersSent) return next(err);
  res.status(500).json({ message: "Internal server error" });
});

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is currently running on http://localhost:${PORT}`);
    console.log(`CORS allowed origins: ${getAllowedOrigins().join(", ")}`);
  });
};

if (isDirectRun) {
  startServer().catch((error) => {
    console.error("Server bootstrap failed:", error);
    process.exit(1);
  });
}

export default app;
