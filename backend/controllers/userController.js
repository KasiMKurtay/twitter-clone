import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const getUserProfile = async (req, res) => {
  const { username } = req.params; //URL parametresinden usernamei aldık

  try {
    const user = await User.findOne({ username }).select("-password"); //Kullanıcıyı username'e göre arar, şifreyi dahil etmez
    if (!user) return res.status(404).json({ message: "User not found" }); //Kullanıcı bulunamazsa hata mesajı döner

    res.status(200).json(user); //Kullanıcıyı döner
  } catch (error) {
    console.log("Error in getUserProfile: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params; //URL parametresinden id'yi aldık
    const userToModify = await User.findById(id); //Kullanıcıyı id'ye göre aratıyoruz
    const currentUser = await User.findById(req.user._id); //Şuanki kullanıcıyı aratıyoruz

    if (id === req.user._id.toString()) {
      //Kullanıcı kendisini takip etmeye calıstıysa
      return res
        .status(400)
        .json({ error: "You can't follow or unfollow yourself" }); //Hata mesajı döner
    }

    if (!userToModify || !currentUser)
      //Kullanıcı bulunamazsa
      return res.status(400).json({ error: "User not found" });

    const isFollowing = currentUser.following.includes(id); //Şuanki kullanıcıyı takip ediyormu diye kontrol ediyoruz

    if (isFollowing) {
      //Şuanki kullanıcıyı takip ediyorsa
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } }); //Takip edieln kullanıcının takipcilerinden kaldırıyoruz
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } }); //Şuanki kullanıcının takip ettiklerinden kaldırıyoruz

      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } }); //Takip edilen kullanıcının takipcilerine ekleme
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } }); //Şuanki kullanıcının takip ettiklerine ekleme
      const newNotification = new Notification({
        type: "follow", //Takip etme bildirimi
        from: req.user._id, //Takip eden kullanıcının id'si
        to: userToModify._id, //Takip edilen kullanıcının id'si
      });

      await newNotification.save(); //Bildirimi kaydediyoruz

      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    console.log("Error in followUnfollowUser: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id; //Şuanki kullanıcının id'sini aldık

    const usersFollowedByMe = await User.findById(userId).select("following"); //Şuanki kullanıcının takip ettiklerini aldık

    const users = await User.aggregate([
      //Kullanıcıları rastgele seciyoruz
      {
        $match: {
          _id: { $ne: userId }, //Kendisi hariç
        },
      },
      { $sample: { size: 10 } }, //Rastgele 10 kullanıcı seciyoruz
    ]);

    const filteredUsers = users.filter(
      (user) => !usersFollowedByMe.following.includes(user._id) //Kullanıcıyı takip etmiyor mu diye kontrol ediyoruz
    );
    const suggestedUsers = filteredUsers.slice(0, 4); //Rastgele 4 kullanıcıyı alıyoruz

    suggestedUsers.forEach((user) => (user.password = null)); //Sifreleri gizliyoruz

    res.status(200).json(suggestedUsers); //Kullanıcıları döner
  } catch (error) {
    console.log("Error in getSuggestedUsers: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { fullName, email, username, currentPassword, newPassword, bio, link } =
    req.body; //Gelen verileri aldık
  let { profileImg, coverImg } = req.body; //Gelen verileri aldık

  const userId = req.user._id; //Şuanki kullanıcının id'sini aldık

  try {
    let user = await User.findById(userId); //Kullanıcıyı id'sine göre arar
    if (!user) return res.status(404).json({ message: "User not found" }); //Kullanıcı bulunamazsa hata mesajı döner

    if (
      (!newPassword && currentPassword) ||
      (!currentPassword && newPassword) //Gelen verilerde hem currentPassword hemde newPassword yoksa
    ) {
      return res.status(400).json({
        error: "Please provide both current password and new password",
      });
    }

    if (currentPassword && newPassword) {
      //Gelen verilerde hem currentPassword hemde newPassword varsa
      const isMatch = await bcrypt.compare(currentPassword, user.password); //Sifreyi karsılastırıyoruz
      if (!isMatch)
        return res.status(400).json({ error: "Current password is incorrect" });
      if (newPassword.length < 6) {
        //Yeni sifrenin uzunlugunu kontrol ediyoruz
        return res
          .status(400)
          .json({ error: "Password must be at least 6 characters long" }); //Yeni sifre en az 6 karakter olmalı
      }

      const salt = await bcrypt.genSalt(10); //Yeni şifreyi bcrypt ile şifreliyoruz ve
      user.password = await bcrypt.hash(newPassword, salt); // kaydediyourz
    }

    if (profileImg) {
      //Gelen verilerde profileImg varsa
      if (user.profileImg) {
        await cloudinary.uploader.destroy(
          //Kullanıcının eski profil resmini siliyoruz
          user.profileImg.split("/").pop().split(".")[0]
        );
      }

      const uploadedResponse = await cloudinary.uploader.upload(profileImg); //Yeni profil resmini yükleme
      profileImg = uploadedResponse.secure_url; //Yüklneenen resmin güvenli URL'sini alıyoruz
    }

    if (coverImg) {
      //Gelen verilerde coverImg varsa
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          //Kullanıcının eski kapak resmini siliyoruz
          user.coverImg.split("/").pop().split(".")[0]
        );
      }

      const uploadedResponse = await cloudinary.uploader.upload(coverImg); //Yeni kapak resmini yükleme
      coverImg = uploadedResponse.secure_url; //Yüklneenen resmin güvenli URL'sini alıyoruz
    }

    user.fullName = fullName || user.fullName; //fullName'i günceller, varsa
    user.email = email || user.email; //email'i günceller, varsa
    user.username = username || user.username; //username'i günceller, varsa
    user.bio = bio || user.bio; //bio'i günceller, varsa
    user.link = link || user.link; //link'i günceller, varsa
    user.profileImg = profileImg || user.profileImg; //profileImg'i günceller, varsa
    user.coverImg = coverImg || user.coverImg; //coverImg'i günceller, varsa

    user = await user.save(); //Kullanıcıyı kaydediyoruz

    user.password = null; //Sifreyi gizliyoruz

    return res.status(200).json(user);
  } catch (error) {
    console.log("Error in updateUser: ", error.message);
    res.status(500).json({ error: error.message });
  }
};
