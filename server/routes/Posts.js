import express from "express";
import { createPost, getAllPosts } from "../controllers/Posts.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

router.get("/", getAllPosts);

// Use upload.single('photo') to accept single file input named 'photo'
router.post("/", upload.single('photo'), createPost);

export default router;
