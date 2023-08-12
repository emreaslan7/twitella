import express from "express";
import * as postsController from "../controllers/postsController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, postsController.getFeedPosts);
router.get("/:userId/posts", verifyToken, postsController.getUserPosts);

router.patch("/:id/like", verifyToken, postsController.likePost);
export default router;
