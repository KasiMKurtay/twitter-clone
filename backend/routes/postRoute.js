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

const router = express.Router(); //Yeni bir router nesnesi oluşturuyor

// AŞŞAĞIDA OLUŞTURULAN TÜM ROTALAR protectRoute'ile auth koruması altında kullanılıyor.

router.get("/all", protectRoute, fetchAllPosts); //Tüm postları getiren GET endpointi olusturuyor
router.get("/user/:username", protectRoute, fetchUserPosts); //Belirli kullanıcının postlarını getiren GET endpointi olusturuyor
router.get("/likes/:id", protectRoute, fetchLikedPosts); //Belirli bir postu beğenen kullanıcıların postlarını getiren GET endpointi olusturuyor
router.get("/following", protectRoute, fetchFollowingPosts); //Takip edilen kullanıcların postlarını getiren GET endpointi olusturuyor
router.post("/create", protectRoute, createNewPost); //Yeni bir post oluşturan POST endpointi olusturuyor
router.post("/comment/:id", protectRoute, addCommentToPost); //Bir posta yorum ekleyen POST endpointi olusturuyor
router.post("/like/:id", protectRoute, togglePostLike); //Bir postu begenen POST endpointi olusturuyor
router.delete("/:id", protectRoute, removePost); //Bir postu silen DELETE endpointi olusturuyor

export default router;
