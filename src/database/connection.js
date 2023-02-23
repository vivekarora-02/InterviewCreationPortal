import mongoose from 'mongoose';

export const connectDB = async () => {
  mongoose.set({ debug: process.env.ENV !== 'prod', returnOriginal: true });
  await mongoose.connect(process.env.MONGO_CONN_STRING);
  console.log('DB connection established!');
};
