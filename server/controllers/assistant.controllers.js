import prisma from "../configs/prisma.js";
import { generateAssistantReply } from "../services/assistant.service.js";
import { classifyAssistantCommand } from "../services/intentClassifier.service.js";

const loadUserProfile = async (userId) =>
  prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      assistantName: true,
    },
  });

const storeHistory = async (userId, command) => {
  if (!command) return;

  try {
    await prisma.userHistory.create({
      data: {
        userId,
        content: String(command).trim().slice(0, 300),
      },
    });
  } catch (error) {
    console.error("Assistant history save error:", error.message);
  }
};

export const respondToAssistant = async (req, res) => {
  try {
    const command = String(req.body?.command || "").trim();
    if (!command) {
      return res.status(400).json({ message: "Command is required." });
    }

    const profile = await loadUserProfile(req.userId);
    const reply = await generateAssistantReply({
      assistantName: req.body?.assistantName || profile?.assistantName || "AuraAI",
      userName: req.body?.userName || profile?.name || "User",
      command,
      pageContext: req.body?.pageContext || {},
      historySummary: req.body?.historySummary || "",
    });

    await storeHistory(req.userId, command);

    return res.status(200).json({
      ...reply,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Assistant respond error:", error);
    return res.status(500).json({
      message: "Unable to process assistant request.",
      response: "Unable to process assistant request.",
      type: "general",
      intent: "general",
      route: "chat",
    });
  }
};

export const classifyAssistant = async (req, res) => {
  try {
    const command = String(req.body?.command || "").trim();
    if (!command) {
      return res.status(400).json({ message: "Command is required." });
    }

    const profile = await loadUserProfile(req.userId);
    const result = await classifyAssistantCommand({
      assistantName: req.body?.assistantName || profile?.assistantName || "AuraAI",
      userName: req.body?.userName || profile?.name || "User",
      command,
    });

    await storeHistory(req.userId, command);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Assistant classify error:", error);
    return res.status(500).json({
      message: "Unable to classify assistant request.",
      type: "general",
      intent: "general",
    });
  }
};

export const pageAssistant = async (req, res) => {
  try {
    const command = String(req.body?.command || "").trim();
    const pageContext = req.body?.pageContext || {};
    if (!command && !String(pageContext.pageText || pageContext.selectedText || "").trim()) {
      return res.status(400).json({ message: "Page command or context is required." });
    }

    const profile = await loadUserProfile(req.userId);
    const reply = await generateAssistantReply({
      assistantName: req.body?.assistantName || profile?.assistantName || "AuraAI",
      userName: req.body?.userName || profile?.name || "User",
      command: command || "Process this page content.",
      pageContext,
    });

    await storeHistory(req.userId, command || "Page assistant request");

    return res.status(200).json({
      ...reply,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Assistant page error:", error);
    return res.status(500).json({
      message: "Unable to process page assistant request.",
      response: "Unable to process page assistant request.",
      type: "page_action",
      intent: "summarize_page",
      route: "page",
    });
  }
};
