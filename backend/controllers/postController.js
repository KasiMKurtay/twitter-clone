import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import { v2 as cloudinary } from "cloudinary";
import Notification from "../models/notification.model.js";

export const createNewPost = async (req, res) => {
  try {
    const { text: newText } = req.body; //Yeni gönderinin metnini aldık
    let { img: newImg } = req.body; //Yeni gönderinin resmi
    const userId = req.user._id.toString(); //Kullanıcı ID'si

    // Kullanıcıyı buluyoruz
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hem metin hem de resim eksikse hata döndürüyoruz
    if (!newText && !newImg) {
      return res.status(400).json({ message: "Please provide text or image" });
    }

    // Eğer resim varsa, Cloudinary'ye yükliyoruz
    if (newImg) {
      const uploadedResponse = await cloudinary.uploader.upload(newImg);
      newImg = uploadedResponse.secure_url; // Resmin güvenli URL'sini alıyoruz
    }

    // Yeni gönderiyi oluşturuyoruz
    const createdPost = new Post({
      user: userId,
      text: newText,
      img: newImg || "", // Eğer resim yoksa boş bir string olarak kaydediyoruz
    });

    // Gönderiyi veritabanına kaydediyoruz
    await createdPost.save();

    res.status(201).json(createdPost);
  } catch (error) {
    console.log("Error in createNewPost controller", error.message);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

export const removePost = async (req, res) => {
  try {
    const postToDelete = await Post.findById(req.params.id); //Gönderiyi buluyoruz
    if (!postToDelete) {
      //Gönderi bulunmazsa hata döner
      return res.status(404).json({ error: "Post not found" });
    }

    if (postToDelete.user.toString() !== req.user._id.toString()) {
      //Kullanıcıya ait değilse silme yetkisi yok
      return res
        .status(401)
        .json({ error: "You are not authorized to delete this post" });
    }
    if (postToDelete.img) {
      //Resim varsa , Cloudinary'den siliyoruz
      const imgId = postToDelete.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }
    await Post.findOneAndDelete(req.params.id); //Gönderiyi siliyoruz
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log("Error in removePost controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const togglePostLike = async (req, res) => {
  try {
    const currentUserId = req.user._id; // Şuanki kullanıcının ID'si
    const { id: postId } = req.params; // Gönderinin ID'si

    const postToLike = await Post.findById(postId); // Gönderiyi buluyoruz

    if (!postToLike) {
      // Gönderi bulunamazsa
      return res.status(404).json({ error: "Post not found" });
    }

    const userLikedThisPost = postToLike.likes.includes(currentUserId); // Kullanıcı bu gönderiyi beğeniyor mu?

    if (userLikedThisPost) {
      // Beğeni varsa kaldırıyoruz
      await Post.updateOne(
        { _id: postId },
        { $pull: { likes: currentUserId } }
      );
      await User.updateOne(
        { _id: currentUserId },
        { $pull: { likedPosts: postId } }
      );

      const updatedLikes = postToLike.likes.filter(
        (id) => id.toString() !== currentUserId.toString()
      ); // Beğeniyi kaldırıyoruz
      return res.status(200).json(updatedLikes); // Başarıyla beğeni kaldırıyoruz
    } else {
      // Beğeni yoksa ekliyoruz
      postToLike.likes.push(currentUserId);
      await postToLike.save(); // Postu kaydediyoruz

      // Kullanıcıyı güncelliyoruz
      await User.updateOne(
        { _id: currentUserId },
        { $push: { likedPosts: postId } }
      );

      // Bildirim gönderiyoruz
      const newNotification = new Notification({
        from: currentUserId,
        to: postToLike.user,
        type: "like",
      });
      await newNotification.save();

      return res
        .status(200)
        .json({ likes: postToLike.likes, likeCount: postToLike.likes.length });
    }
  } catch (error) {
    console.log("Error in togglePostLike controller", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

export const addCommentToPost = async (req, res) => {
  try {
    const { text: commentText } = req.body; //Yorum metnini alır
    const postId = req.params.id; //Gönderi ID'sini alır
    const userId = req.user._id; // Kullanıcı ID'sini alır

    if (!commentText) {
      //Yorum metni eksikse hata döner
      return res.status(400).json({ error: "Text field is required" });
    }
    const post = await Post.findById(postId); //Gönderiyi bulur
    if (!post) {
      //Gönderi bulunamazsa hata döner
      return res.status(404).json({ error: "Post not found" });
    }
    const newComment = { user: userId, text: commentText }; //Yeri yorumu oluşturur

    post.comments.push(newComment); //Yorumu ekler

    await post.save(); //Gönderiyi kaydeder

    res.status(200).json(post); //güncellenmiş gönderiyi döner
  } catch (error) {
    console.log("Error in addCommentToPost controller", error);
    res.status(500).json({ error: "Internal server Error" });
  }
};

export const fetchAllPosts = async (req, res) => {
  try {
    const allPosts = await Post.find() //Tüm gönderileri bulur
      .sort({ createdAt: -1 }) //Gönderileri en yeniye göre sıralar
      .populate({ path: "user", select: "-password" }) //Kullanıcı bilgilerini ekler
      .populate({ path: "comments.user", select: "-password" }); //Yorum yapan kullanıcı bilgilerini ekler

    if (allPosts.length === 0) {
      //Hiç gönderi yoksa boş bir dizi döner
      return res.status(200).json([]);
    }

    res.status(200).json(allPosts); //Gönderileri döner
  } catch (error) {
    console.log("Error in fetchAllPosts controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const fetchLikedPosts = async (req, res) => {
  const userId = req.params.id; //Kullanıcı ID'sini alır
  try {
    const userToFetch = await User.findById(userId); //Kullanıcıyı bulur

    if (!userToFetch) {
      //Kullanıco bulunamazsa hata döner
      return res.status(404).json({ error: "User not found" });
    }

    const likedPostsList = await Post.find({
      _id: { $in: userToFetch.likedPosts }, //Kullanıcının beğendiği gödnerileri bulur
    })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-paswword",
      });

    res.status(200).json(likedPostsList); //Beğenilen gönderleri döner
  } catch (error) {
    console.log("Error in fetchLikedPosts controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const fetchFollowingPosts = async (req, res) => {
  try {
    const currentUserId = req.user._id; //Kullanıcı ID'sini alır

    const currentUser = await User.findById(currentUserId); //Kullanıcıyı bulur
    if (!currentUser) {
      //Kullanıcı bulunamazsa hata döner
      return res.status(404).json({ error: "User not found" });
    }

    const followingUsers = currentUser.following; //Kullanıcının takip ettiği kişileri alır

    const followingPostsList = await Post.find({
      user: { $in: followingUsers }, //Kullanıcının takip ettiği kişilerin gönderilerini bulur
    })
      .sort({
        createdAt: -1, //Gönderileri en yeniye göre sıralar
      })
      .populate({ path: "user", select: "-password" }) //Kullanıcı bilgilerini ekler
      .populate({ path: "comments.user", select: "-password" }); //Yorum yapan kullanıcı bilgilerini ekler

    res.status(200).json(followingPostsList); //Takip ettiği kişilerin gönderilerini döner
  } catch (error) {
    console.log("Error in fetchFollowingPosts controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const fetchUserPosts = async (req, res) => {
  try {
    const { username: targetUsername } = req.params; //URL parametresinden usernamei alır

    const userToFetch = await User.findOne({ username: targetUsername }); //Kullanıcıyı username'e göre bulur
    if (!userToFetch) {
      //Kullanıcı bulunamazsa hata döner
      return res.status(404).json({ error: "User not found" });
    }

    const userPosts = await Post.find({ user: userToFetch._id }) //Kullanıcının gönderilerini bulur
      .sort({ createdAt: -1 }) //Gönderileri en yeniye göre sıralar
      .populate({ path: "user", select: "-password" }) //Kullanıcı bilgilerini ekler
      .populate({ path: "comments.user", select: "-password" }); //Yorum yapan kullanıcı bilgilerini ekler

    res.status(200).json(userPosts); //Kullanıcının gönderilerini döner
  } catch (error) {
    console.log("Error in fetchUserPosts controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
