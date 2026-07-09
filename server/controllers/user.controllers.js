import moment from "moment";
import prisma from "../configs/prisma.js";
import uploadOnCloudinary from "../configs/cloudinary.js";
import { generateAssistantReply } from "../services/assistant.service.js";
import {
  serializeChatSession,
  serializeUser,
  userInclude,
} from "../utils/userSerializers.js";

const sanitizeTitle = (title) =>
  String(title || "New Chat")
    .trim()
    .slice(0, 80) || "New Chat";

const sanitizeContent = (content) => String(content || "").trim().slice(0, 4000);

const sessionInclude = {
  messages: {
    orderBy: { createdAt: "asc" },
  },
};

const getOwnedSession = (userId, chatId) =>
  prisma.chatSession.findFirst({
    where: { id: chatId, userId },
    include: sessionInclude,
  });

export const getCurrentUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: userInclude,
    });

    if (!user) {
      return res.status(400).json({ message: "USER NOT FOUND" });
    }

    return res.status(200).json(serializeUser(user));
  } catch (error) {
    console.error("Error in getCurrentUser catch block:", error);
    return res.status(500).json({ message: "GET CURRENT USER ERROR" });
  }
};

export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;
    if (!assistantName?.trim()) {
      return res.status(400).json({ message: "Assistant name is required." });
    }

    let assistantImage;

    if (req.file) {
      try {
        assistantImage = await uploadOnCloudinary(
          req.file.buffer,
          req.file.originalname
        );
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({ message: "Failed to upload image" });
      }
    } else {
      assistantImage = imageUrl;
    }

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        assistantName: assistantName.trim(),
        assistantImage,
      },
      include: userInclude,
    });

    return res.status(200).json(serializeUser(user));
  } catch (error) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "User not found" });
    }
    console.error("Update assistant error:", error);
    return res.status(500).json({ message: "UPDATE USER ERROR" });
  }
};

export const askToAssistant = async (req, res) => {
  try {
    const { command, assistantName, userName } = req.body;

    if (!command || !assistantName || !userName) {
      return res.status(400).json({ response: "Missing required fields" });
    }

    const assistantResult = await generateAssistantReply({
      command,
      assistantName,
      userName,
    });

    await prisma.userHistory.create({
      data: {
        userId: req.userId,
        content: String(command).slice(0, 300),
      },
    });

    return res.json({
      ...assistantResult,
      generatedAt: moment().toISOString(),
    });
  } catch (error) {
    console.error("ASK ASSISTANT ERROR:", error);
    return res
      .status(500)
      .json({ response: "ASK ASSISTANT ERROR occurred on the server." });
  }
};

export const getChatSessions = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const offset = Math.max(Number(req.query.offset) || 0, 0);

    const [total, sessions] = await prisma.$transaction([
      prisma.chatSession.count({ where: { userId: req.userId } }),
      prisma.chatSession.findMany({
        where: { userId: req.userId },
        orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
        skip: offset,
        take: limit,
        include: sessionInclude,
      }),
    ]);

    return res.status(200).json({
      total,
      limit,
      offset,
      sessions: sessions.map(serializeChatSession),
    });
  } catch (error) {
    console.error("GET CHAT SESSIONS ERROR:", error.message);
    return res.status(500).json({ message: "Unable to load chats." });
  }
};

export const createChatSession = async (req, res) => {
  try {
    const title = sanitizeTitle(req.body?.title);
    const created = await prisma.chatSession.create({
      data: {
        userId: req.userId,
        title,
      },
      include: sessionInclude,
    });

    return res.status(201).json(serializeChatSession(created));
  } catch (error) {
    console.error("CREATE CHAT SESSION ERROR:", error.message);
    return res.status(500).json({ message: "Unable to create chat." });
  }
};

export const updateChatSession = async (req, res) => {
  try {
    const { chatId } = req.params;
    const existing = await getOwnedSession(req.userId, chatId);
    if (!existing) return res.status(404).json({ message: "Chat not found." });

    const data = {};
    if (typeof req.body?.title === "string") data.title = sanitizeTitle(req.body.title);
    if (typeof req.body?.pinned === "boolean") data.pinned = req.body.pinned;

    const session = await prisma.chatSession.update({
      where: { id: chatId },
      data,
      include: sessionInclude,
    });

    return res.status(200).json(serializeChatSession(session));
  } catch (error) {
    console.error("UPDATE CHAT SESSION ERROR:", error.message);
    return res.status(500).json({ message: "Unable to update chat." });
  }
};

export const deleteChatSession = async (req, res) => {
  try {
    const { chatId } = req.params;
    const existing = await getOwnedSession(req.userId, chatId);
    if (!existing) return res.status(404).json({ message: "Chat not found." });

    await prisma.chatSession.delete({ where: { id: chatId } });
    const sessions = await prisma.chatSession.findMany({
      where: { userId: req.userId },
      orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
      include: sessionInclude,
    });

    return res.status(200).json({
      success: true,
      sessions: sessions.map(serializeChatSession),
    });
  } catch (error) {
    console.error("DELETE CHAT SESSION ERROR:", error.message);
    return res.status(500).json({ message: "Unable to delete chat." });
  }
};

export const addChatMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const role = req.body?.role;
    const content = sanitizeContent(req.body?.content);
    if (!["user", "assistant"].includes(role) || !content) {
      return res.status(400).json({ message: "Invalid message payload." });
    }

    const existing = await getOwnedSession(req.userId, chatId);
    if (!existing) return res.status(404).json({ message: "Chat not found." });

    const session = await prisma.$transaction(async (tx) => {
      await tx.chatMessage.create({
        data: {
          sessionId: chatId,
          role,
          content,
        },
      });

      return tx.chatSession.update({
        where: { id: chatId },
        data: { updatedAt: new Date() },
        include: sessionInclude,
      });
    });

    return res.status(200).json(serializeChatSession(session));
  } catch (error) {
    console.error("ADD CHAT MESSAGE ERROR:", error.message);
    return res.status(500).json({ message: "Unable to save message." });
  }
};
