import Post from "../models/Posts.js";
import { createError } from "../error.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Your existing createPost function
export const createPost = async (req, res, next) => {
  try {
    const { name, prompt } = req.body;

    if (!req.file) {
      return next(createError(400, "No image file uploaded"));
    }

    const result = await cloudinary.uploader.upload(req.file.path);
    fs.unlinkSync(req.file.path);

    const newPost = await Post.create({
      name,
      prompt,
      photo: result.secure_url,
    });

    return res.status(201).json({ success: true, data: newPost });
  } catch (error) {
    console.error("Create post error:", error);
    return next(createError(error.status, error.message));
  }
};

// Add this function to fetch all posts
export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({});
    return res.status(200).json({ success: true, data: posts });
  } catch (error) {
    console.error("Get posts error:", error);
    return next(createError(500, "Failed to get posts"));
  }
};
