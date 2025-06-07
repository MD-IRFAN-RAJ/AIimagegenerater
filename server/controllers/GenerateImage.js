import * as dotenv from "dotenv";
import { createError } from "../error.js";
import axios from "axios";
import { RateLimiter } from "limiter";

dotenv.config();

const limiter = new RateLimiter({
  tokensPerInterval: 5,
  interval: "minute"
});

export const generateImage = async (req, res, next) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return next(createError(400, "Prompt is required and must be a string"));
    }

    if (prompt.length > 4000) {
      return next(createError(400, "Prompt must be less than 4000 characters"));
    }

    const remainingRequests = await limiter.removeTokens(1);
    if (remainingRequests < 0) {
      return next(createError(429, "Too many requests. Please wait a minute before generating more images."));
    }

    const response = await axios.post(
      "https://api.deepai.org/api/text2img",
      { text: prompt },
      {
        headers: {
          "Api-Key": process.env.DEEPAI_API_KEY
        }
      }
    );

    if (!response.data || !response.data.output_url) {
      throw new Error("No image data received from DeepAI");
    }

    res.status(200).json({
      photo: response.data.output_url,
      remainingRequests: Math.floor(remainingRequests)
    });

  } catch (error) {
    console.error("Image generation error:", {
      error: error.message,
      response: error.response?.data,
      timestamp: new Date().toISOString()
    });

    const statusCode = error.response?.status || 500;
    const errorMessage = error.response?.data?.err || "Image generation failed with DeepAI";

    next(createError(statusCode, errorMessage));
  }
};
