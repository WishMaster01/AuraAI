import express from "express";
import {
  addChatMessage,
  askToAssistant,
  createChatSession,
  deleteChatSession,
  getChatSessions,
  getCurrentUser,
  updateChatSession,
  updateAssistant,
} from "../controllers/user.controllers.js";
import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.get("/current", isAuth, getCurrentUser);
userRouter.post(
  "/update",
  isAuth,
  upload.single("assistantImage"),
  updateAssistant
);
userRouter.post("/asktoassistant", isAuth, askToAssistant);
userRouter.get("/chats", isAuth, getChatSessions);
userRouter.post("/chats", isAuth, createChatSession);
userRouter.patch("/chats/:chatId", isAuth, updateChatSession);
userRouter.delete("/chats/:chatId", isAuth, deleteChatSession);
userRouter.post("/chats/:chatId/messages", isAuth, addChatMessage);

export default userRouter;
