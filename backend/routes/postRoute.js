import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  addCommentToPost,
  createNewPost,
  removePost,
  fetchAllPosts,
  fetchFollowingPosts,
  fetchLikedPosts,
  fetchUserPosts,
  togglePostLike,
} from "../controllers/postController.js";

const router = express.Router();

router.get("/all", protectRoute, fetchAllPosts);
router.get("/user/:username", protectRoute, fetchUserPosts);
router.get("/likes/:id", protectRoute, fetchLikedPosts);
router.get("/following", protectRoute, fetchFollowingPosts);
router.post("/create", protectRoute, createNewPost);
router.post("/comment/:id", protectRoute, addCommentToPost);
router.post("/like/:id", protectRoute, togglePostLike);
router.delete("/:id", protectRoute, removePost);

export default router;
