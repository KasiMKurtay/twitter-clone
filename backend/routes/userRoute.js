import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  followUnfollowUser,
  getSuggestedUsers,
  getUserProfile,
  updateUser,
} from "../controllers/userController.js";

const router = express.Router(); //Yeni bir router nesnesi oluşturuyor

// AŞŞAĞIDA OLUŞTURULAN TÜM ROTALAR protectRoute'ile auth koruması altında kullanılıyor.

router.get("/profile/:username", protectRoute, getUserProfile); //Kullanıcının profil bilgilerini getiren  GET endpointi olusturuyor
router.get("/suggested", protectRoute, getSuggestedUsers); //Kullanıcının takip edebileceği kullanıcıları getiren GET endpointi olusturuyor
router.post("/follow/:id", protectRoute, followUnfollowUser); //Kullanıcının takip edebileceği kullanıcıları getiren GET endpointi olusturuyor
router.post("/update", protectRoute, updateUser); //Kullanıcının takip edebileceği kullanıcıları getiren GET endpointi olusturuyor

export default router;
