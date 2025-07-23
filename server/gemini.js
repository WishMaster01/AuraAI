// gemini.js
import axios from "axios";

const geminiResponse = async (command, assistantName, userName) => {
  try {
    const GEMINI_API_URL = process.env.GEMINI_API_URL;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_URL || !GEMINI_API_KEY) {
      console.error(
        "Missing GEMINI_API_URL or GEMINI_API_KEY environment variables!"
      );
      return {
        type: "general",
        response:
          "Assistant API configuration error. Please check server logs.",
        userInput: command,
      };
    }

    const prompt = `You are a virtual assistant named ${
      assistantName || "Assistant"
    }, created by ${userName || "the user"}.
You are not Google. Your job is to classify voice input and respond with a JSON only.

Respond ONLY in this format:
{
  "type": "general" | "Google Search" | "Youtube" | "youtube_play" |
  "youtube_open" | "get_time" | "get_date" | "get_day" | "get_month" |
  "calculator_open" | "instagram_open" | "facebook_open" | "weather_show",
  "userInput": "<cleaned user command>",
  "response": "<short spoken reply>"
}

Rules:
- If user says "open YouTube", set "type": "youtube_open".
- If user asks to search on Google or YouTube, extract only search terms in "userInput".
- Don't include your name in "userInput".
- Use ${userName} if user asks "who created you?"
- No explanation. Return only the valid JSON.
- If you cannot determine a specific type, default to "general".

User input: "${command}"
Now reply.`.trim();

    const response = await axios.post(
      GEMINI_API_URL,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    let geminiRawText = response.data.candidates[0].content.parts[0].text;

    const jsonMatch = geminiRawText.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      geminiRawText = jsonMatch[1].trim();
    } else {
      console.warn(
        "Gemini response not wrapped in ````json` block, attempting direct parse."
      );
    }

    try {
      const parsedGeminiResponse = JSON.parse(geminiRawText);
      return parsedGeminiResponse; // Return the parsed JSON object
    } catch (parseError) {
      console.error("Failed to parse Gemini's response as JSON:", parseError);
      console.error("Raw text that failed to parse:", geminiRawText);
      return {
        type: "general",
        response:
          "I'm sorry, I encountered an issue processing the AI's response.",
        userInput: command,
      };
    }
  } catch (error) {
    console.error("Error communicating with Google Gemini API:");
    if (error.response) {
      console.error("  Status:", error.response.status);
      console.error("  Data:", error.response.data);
    } else if (error.request) {
      console.error("  No response received. Request:", error.request);
    } else {
      console.error("  Error message:", error.message);
    }

    return {
      type: "general",
      response:
        "I'm currently unable to process your request. Please try again later.",
      userInput: command,
    };
  }
};

export default geminiResponse;
