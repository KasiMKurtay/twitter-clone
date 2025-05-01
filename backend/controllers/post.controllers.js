import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import { v2 as cloudinary } from "cloudinary";
import Notification from "../models/notification.model.js";

export const createNewPost = async (req, res) => {
  try {
    const { text: newText } = req.body;
    let { img: newImg } = req.body;
    const userId = req.user._id.toString();

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!newText && !newImg) {
      return res.status(400).json({ message: "Please provide text or image" });
    }
    if (newImg) {
      const uploadedResponse = await cloudinary.uploader.upload(newImg, {
        img: uploadedResponse.secure_url,
      });
    }

    const createdPost = new Post({
      user: userId,
      text: newText,
      img: newImg,
    });

    await createdPost.save();
    res.status(201).json(createdPost);
  } catch (error) {
    console.log("Error in createNewPost controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const removePost = async (req, res) => {
  try {
    const postToDelete = await Post.findById(req.params.id);
    if (!postToDelete) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (postToDelete.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ error: "You are not authorized to delete this post" });
    }
    if (postToDelete.img) {
      const imgId = postToDelete.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }
    await Post.findOneAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log("Error in removePost controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const togglePostLike = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const { id: postId } = req.params;

    const postToLike = await Post.findById(postId);

    if (!postToLike) {
      return res.status(404).json({ error: "Post not found" });
    }

    const userLikedThisPost = postToLike.likes.includes(currentUserId);

    if (userLikedThisPost) {
      await Post.updateOne(
        { _id: postId },
        { $pull: { likes: currentUserId } }
      );
      await User.updateOne(
        { _id: currentUserId },
        { $pull: { likedPosts: postId } }
      );
      res.status(200).json({ message: "Post unliked successfully" });
    } else {
      postToLike.likes.push(currentUserId);
      await User.updateOne(
        { _id: currentUserId },
        { $push: { likedPosts: postId } }
      );
      await postToLike.save();

      const newNotification = new Notification({
        from: currentUserId,
        to: postToLike.user,
        type: "like",
      });
      await newNotification.save();

      res.status(200).json({ message: "Post liked successfully" });
    }
  } catch (error) {
    console.log("Error in togglePostLike controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addCommentToPost = async (req, res) => {
  try {
    const { text: commentText } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;

    if (!commentText) {
      return res.status(400).json({ error: "Text field is required" });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    const newComment = { user: userId, text: commentText };

    post.comments.push(newComment);

    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.log("Error in addCommentToPost controller", error);
    res.status(500).json({ error: "Internal server Error" });
  }
};

export const fetchAllPosts = async (req, res) => {
  try {
    const allPosts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });

    if (allPosts.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(allPosts);
  } catch (error) {
    console.log("Error in fetchAllPosts controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const fetchLikedPosts = async (req, res) => {
  const userId = req.params.id;
  try {
    const userToFetch = await User.findById(userId);

    if (!userToFetch) {
      return res.status(404).json({ error: "User not found" });
    }

    const likedPostsList = await Post.find({
      _id: { $in: userToFetch.likedPosts },
    })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-paswword",
      });

    res.status(200).json(likedPostsList);
  } catch (error) {
    console.log("Error in fetchLikedPosts controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const fetchFollowingPosts = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const followingUsers = currentUser.following;

    const followingPostsList = await Post.find({
      user: { $in: followingUsers },
    })
      .sort({
        createdAt: -1,
      })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });

    res.status(200).json(followingPostsList);
  } catch (error) {
    console.log("Error in fetchFollowingPosts controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const fetchUserPosts = async (req, res) => {
  try {
    const { username: targetUsername } = req.params;

    const userToFetch = await User.findOne({ username: targetUsername });
    if (!userToFetch) {
      return res.status(404).json({ error: "User not found" });
    }

    const userPosts = await Post.find({ user: userToFetch._id })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });

    res.status(200).json(userPosts);
  } catch (error) {
    console.log("Error in fetchUserPosts controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
