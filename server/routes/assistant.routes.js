import express from "express";
import isAuth from "../middlewares/isAuth.js";
import {
  classifyAssistant,
  pageAssistant,
  respondToAssistant,
} from "../controllers/assistant.controllers.js";

const assistantRouter = express.Router();

assistantRouter.post("/respond", isAuth, respondToAssistant);
assistantRouter.post("/classify", isAuth, classifyAssistant);
assistantRouter.post("/page", isAuth, pageAssistant);

export default assistantRouter;

