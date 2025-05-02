import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    // userId içeren JWT token oluşturur
    expiresIn: "15d", // Token 15 gün geçerli olacak şekilde ayarlanır
  });

  res.cookie("jwt", token, {
    // JWT token'ı tarayıcıya cookie olarak gönderir
    maxAge: 15 * 24 * 60 * 60 * 1000, // Cookie 15 gün geçerli olur
    httpOnly: true, // Cookie sadece sunucu tarafından erişilebilir
    sameSite: "strict", // Cross-site isteklere karşı koruma sağlar
    secure: process.env.NODE_ENV !== "development", // Geliştirme ortamı dışındaysa cookie sadece HTTPS üzerinden iletilir
  });
};
