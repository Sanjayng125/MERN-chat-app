import mongoose from "mongoose";

const connectDb = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("MongoDB Connected");
    })
    .catch((err) => console.log(err));
};

export default connectDb;
