import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./configs/db.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import geminiResponse from "./gemini.js";

const app = express();
const PORT = process.env.PORT || 8080;

// Use an environment variable for the allowed client origin
// Fallback to a development URL if CLIENT_ORIGIN is not set (e.g., for local testing)
const allowedClientOrigin =
  process.env.CLIENT_ORIGIN || "http://localhost:5173"; // Adjust localhost port if your frontend dev server runs on a different one

const corsOptions = {
  origin: allowedClientOrigin,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.get("/", async (req, res) => {
  let prompt = req.query.prompt;
  let data = await geminiResponse(prompt);
  res.json(data);
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is currently running on http://localhost:${PORT}`);
  console.log(`CORS allowed origin: ${allowedClientOrigin}`);
});
