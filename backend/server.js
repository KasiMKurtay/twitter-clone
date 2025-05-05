import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

import authRoutes from "./routes/authRoute.js";
import userRoutes from "./routes/userRoute.js";
import postRoutes from "./routes/postRoute.js";
import notificationRoute from "./routes/notificationRoute.js";

import connectMongoDB from "./db/connectMongoDB.js";

dotenv.config(); //.env dosyasındaki değişkenleri kullanabilmek için

cloudinary.config({
  //cloudinary bağlantısı
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, //cloudinary cloud name .env'den alınır
  api_key: process.env.CLOUDINARY_API_KEY, //aynı şekilde
  api_secret: process.env.CLOUDINARY_API_SECRET, //burasıda aynı şekilde
});

const app = express(); //express uygulaması başlatılır
const port = process.env.PORT || 5000; //SUnucunun portu belirlenir

app.use(express.json({ limit: "5mb" })); //JSON formatındaki istek gövdelerini parse edeiyoruz //  limiti 5mb olarak düzelttik
app.use(express.urlencoded({ extended: true })); //URL-encoded veri (form verisi) çözümlemesi yapar

app.use(cookieParser()); //Cookie'leri parse eder

app.use("/api/auth", authRoutes); //api auth altında auth rotalarını kullanıma sunar
app.use("/api/users", userRoutes); //api/users altında kullanıcı rotalarını kullanıma sunar
app.use("/api/posts", postRoutes); //api posts altında rotalarını kullanıma sunar
app.use("/api/notifications", notificationRoute); //api notifications altında rotalarını kullanıma sunar

app.listen(port, () => {
  //Belirtilen portta sunucuyu başlatır
  console.log(`Server is running on port ${port}`); //Sunucu portunu yazdırır
  connectMongoDB();
});
