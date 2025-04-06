import * as dotenv from "dotenv";
import { createError } from "../error.js";
import OpenAI from "openai";

dotenv.config();

// Setup OpenAI instance
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Controller to generate Image
export const generateImage = async (req, res, next) => {
  try {
    const { prompt } = req.body;

    const response = await openai.images.generate({
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });

    const generatedImage = response.data[0].b64_json;

    res.status(200).json({ photo: generatedImage });
  } catch (error) {
    const message =
    error?.response?.data?.error?.message ||
    error?.message ||
    "Something went wrong while generating the image";

  if (message.includes("Billing hard limit")) {
    return next(createError(403, "OpenAI usage limit exceeded. Please check your billing settings."));
  }

  next(createError(error.status || 500, message));
  }
};
