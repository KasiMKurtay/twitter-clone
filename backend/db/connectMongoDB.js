import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_DB_URI); // .env dosyasındaki URI ile MongoDB'ye bağlanır
    console.log(`MongoDB Connected: ${conn.connection.host}`); // Bağlantı başarılıysa bağlantı adresini konsola yazdırır
  } catch (error) {
    console.error("Error connecting to MongoDB:", error); // Bağlantı hatası varsa hatayı konsola yazdırır
    process.exit(1); // Hata durumunda işlemi durdurur (exit code 1: başarısızlık)
  }
};

export default connectMongoDB;
