import express from "express";
import { getMe, login, logout, signup } from "../controllers/authController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/me", protectRoute, getMe); // Giriş yapan kullanıcının bilgilerini getiren GET endpoint (korumalı)
router.post("/signup", signup); // Yeni kullanıcı kaydı oluşturan POST endpoint
router.post("/login", login); // Kullanıcının giriş yapmasını sağlayan POST endpoint
router.post("/logout", logout); // Kullanıcının çıkış yapmasını sağlayan POST endpoint

export default router;
