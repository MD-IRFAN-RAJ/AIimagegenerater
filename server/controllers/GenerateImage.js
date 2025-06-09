import * as dotenv from "dotenv";
import { createError } from "../error.js";
import axios from "axios";
import { RateLimiter } from "limiter";
dotenv.config();

const limiter = new RateLimiter({ tokensPerInterval: 5, interval: "minute" });

export const generateImage = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== "string") return next(createError(400, "Invalid prompt"));
    if (prompt.length > 4000) return next(createError(400, "Prompt too long"));
    const remaining = await limiter.removeTokens(1);
    if (remaining < 0) return next(createError(429, "Rate limit exceeded"));

    const response = await axios.post(
      "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
      {
        text_prompts: [{ text: prompt, weight: 1 }],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        steps: 30,
        samples: 1
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    );

    const base64Image = response.data?.artifacts?.[0]?.base64;
    if (!base64Image) return next(createError(500, "Image generation failed"));

    res.status(200).json({
      photo: `data:image/png;base64,${base64Image}`,
      remainingRequests: Math.floor(remaining)
    });
  } catch (err) {
    console.error("Stability AI Error:", err.response?.data || err.message);
    next(createError(err.response?.status || 500, err.response?.data?.message || err.message));
  }
};
