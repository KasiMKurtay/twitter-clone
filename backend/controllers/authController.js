import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body; //Gelen verileri aldık

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //Email formatını kontrol ediyoruz
    if (!emailRegex.test(email)) {
      //Email formatını kontrol ediyoruz
      return res.status(400).json({ error: "Invalid email format" });
    }

    const existingUser = await User.findOne({ username }); //Kullanıcıyı username'e göre arar
    if (existingUser) {
      //Kullanıcı bulunamazsa hata mesajı döner
      return res.status(400).json({ error: "Username is already taken" });
    }

    const existingEmail = await User.findOne({ email }); //Kullanıcıyı email'e göre arar
    if (existingEmail) {
      //Kullanıcı bulunamazsa hata mesajı döner
      return res.status(400).json({ error: "Email is already taken" });
    }

    if (password.length < 6) {
      //Yeni sifrenin uzunlugunu kontrol ediyoruz
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    const salt = await bcrypt.genSalt(10); //Sifreleme yapmak icin salt olusturuyoruz
    const hashedPassword = await bcrypt.hash(password, salt); //Sifreyi hashliyoruz

    const newUser = new User({
      //Yeni kullanıcı olusturuyoruz
      fullName, //Gelen verileri ekliyoruz
      username,
      email,
      password: hashedPassword, //Hashlenmis sifreyi ekliyoruz
    });

    if (newUser) {
      //Yeni kullanıcı olusturulduysa
      generateTokenAndSetCookie(newUser._id, res); //Token ve cookie olusturuyoruz
      await newUser.save(); //Yeni kullanıcıyı veritabanına kaydediyoruz

      res.status(201).json({
        //Kullanıcı bilgilerini döner
        _id: newUser._id, //Kullanıcı ID'sini döner
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body; //Gelen verileri aldık
    const user = await User.findOne({ username }); //Kullanıcıyı username'e göre arar
    const isPasswordCorrect = await bcrypt.compare(
      //Sifreyi karsılastırıyoruz
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      //Kullanıcı bulunamazsa veya sifre yanlışsa
      return res.status(400).json({ error: "Invalid username or password" });
    }

    generateTokenAndSetCookie(user._id, res); //Token ve cookie olusturuyoruz

    res.status(200).json({
      //Kullanıcı bilgilerini döner
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 }); //Cookie'yi sıfırlar
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password"); //Kullanıcının bilgilerini alır
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getMe controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
