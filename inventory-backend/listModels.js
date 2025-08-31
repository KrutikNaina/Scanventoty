import { config } from "dotenv";
config(); // load .env variables

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini client
const genAI = new GoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function listModels() {
  try {
    const response = await genAI.models.list(); // updated method
    console.log("Available models:", response);
  } catch (error) {
    console.error("Error listing models:", error);
  }
}

listModels();
