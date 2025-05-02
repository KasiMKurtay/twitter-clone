import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt; // İstekten JWT token'ını çeker (cookie'den)
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token found" }); // Token yoksa yetkisiz hatası döner
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Token'ı çözümler ve doğruluğunu kontrol eder

    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" }); // Token geçersizse yetkisiz hatası döner
    }

    const user = await User.findById(decoded.userId).select("-password"); // Token içindeki userId ile kullanıcıyı bulur ve şifreyi dahil etmez

    if (!user) {
      return res.status(401).json({ error: "Unauthorized: User not found" }); // Kullanıcı bulunamazsa yetkisiz hatası döner
    }

    req.user = user; // Kullanıcıyı isteğe ekler, diğer middleware veya route'lar tarafından erişilebilir olur
    next(); // İşleme devam etmesi için bir sonraki middleware'e geçer
  } catch (error) {
    console.log("Error in protectRoute middleware:", error); // Hata logunu konsola yazdırır
    res.status(500).json({ error: "Internal server error" }); // Sunucu hatası döner
  }
};
