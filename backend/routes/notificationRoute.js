import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  deleteNotification,
  deleteNotifications,
  getNotifications,
} from "../controllers/notificationController.js";
const router = express.Router();

// AŞŞAĞIDA OLUŞTURULAN TÜM ROTALAR protectRoute'ile auth koruması altında kullanılıyor.

router.get("/", protectRoute, getNotifications); // Kullanıcının tüm bildirimlerini getiren GET endpoint
router.delete("/", protectRoute, deleteNotifications); // Kullanıcının tüm bildirimlerini silen DELETE endpoint
router.delete("/:id", protectRoute, deleteNotification); // Belirli bir bildirimi silen DELETE endpoint

export default router;
