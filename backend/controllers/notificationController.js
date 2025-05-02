import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id; //Kullanıcı ID'sini alır

    const notify = await Notification.find({ to: userId }).populate({
      //Kullanıcının bildirimlerini bulur
      path: "from", //Bildirim yapan kullanıcıyı ekler
      select: "username profileImg", //Kullanıcı bilgilerini ekler
    });

    await Notification.updateMany({ to: userId }, { read: true }); //Kullanıcının bildirimlerini okundu olarak günceller

    res.status(200).json(notify); //Kullanıcının bildirimlerini döner
  } catch (error) {
    console.log("Error in getNotifications controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteNotifications = async (req, res) => {
  try {
    const userId = req.user._id; //Kullanıcı ID'sini alır

    await Notification.deleteMany({ to: userId }); //Kullanıcının bildirimlerini siler

    res.status(200).json({ message: "Notifications deleted successfully" });
  } catch (error) {
    console.log("Error in deleteNotifications controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const userId = req.user._id; //Kullanıcı ID'sini alır
    const notifyId = req.params.id; //Bildirim ID'sini alır

    const notification = await Notification.findById(notifyId); //Bildirimleri bulur

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    if (notification.to.toString() !== userId.toString()) {
      //Kullanıcıya ait değilse silme yetkisi yok
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this notification" });
    }

    await Notification.findByIdAndDelete(notifyId); //Bildirimleri siler

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.log("Error in deleteNotification controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
