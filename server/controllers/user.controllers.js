import { response } from "express";
import moment from "moment";
import uploadOnCloudinary from "../configs/cloudinary.js";
import geminiResponse from "../gemini.js";
import User from "../models/user.model.js";

export const getCurrentUser = async (req, res) => {
  try {
    console.log("userId from req in getCurrentUser:", req.userId);

    const userId = req.userId;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(400).json({ message: "USER NOT FOUND" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error in getCurrentUser catch block:", error);
    return res.status(500).json({ message: "GET CURRENT USER ERROR" });
  }
};

export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;
    let assistantImage;

    if (req.file) {
      assistantImage = await uploadOnCloudinary(req.file.path);
    } else {
      assistantImage = imageUrl;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        assistantName,
        assistantImage,
      },
      { new: true }
    ).select("-password");

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "UPDATE USER ERROR" });
  }
};

export const askToAssistant = async (req, res) => {
  try {
    const { command, assistantName, userName } = req.body;

    if (!command || !assistantName || !userName) {
      return res.status(400).json({ response: "Missing required fields" });
    }

    const gemResult = await geminiResponse(command, assistantName, userName);

    if (!gemResult || !gemResult.type || !gemResult.response) {
      console.error("Gemini response missing type or response:", gemResult);
      return res.status(400).json({
        response: "The assistant's response was incomplete or malformed.",
      });
    }

    const { type, userInput, response: geminiReply } = gemResult;

    switch (type) {
      case "get_date":
        return res.json({
          type,
          userInput,
          response: `Current date is ${moment().format("YYYY-MM-DD")}`,
        });

      case "get_time":
        return res.json({
          type,
          userInput,
          response: `Current time is ${moment().format("hh:mm A")}`,
        });

      case "get_day":
        return res.json({
          type,
          userInput,
          response: `Today is ${moment().format("dddd")}`,
        });

      case "get_month":
        return res.json({
          type,
          userInput,
          response: `Current Month is ${moment().format("MMMM")}`,
        });

      default:
        return res.json({ type, userInput, response: geminiReply });
    }
  } catch (error) {
    console.error("ASK ASSISTANT ERROR:", error);
    return res
      .status(500)
      .json({ response: "ASK ASSISTANT ERROR occurred on the server." });
  }
};
