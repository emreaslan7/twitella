import express from "express";
import * as postsController from "../controllers/postsController.js";
import * as commentsController from "../controllers/commentsController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, postsController.getFeedPosts);
router.get("/:userId/posts", verifyToken, postsController.getUserPosts);

router
 .route("/:id/comments")
 .get(verifyToken, commentsController.getPostComments)
 .post(verifyToken, commentsController.postComment);

router.patch("/:commentId", verifyToken, commentsController.likeComment);

router.patch("/:id/like", verifyToken, postsController.likePost);
export default router;
