import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import listingRouter from "./routes/listing.route.js";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from 'path'
// const dotenv = require('dotenv')
dotenv.config();

const app = express();
const _dirname = path.resolve();
const url = process.env.MONGO
console.log(url)
// const url = 'mongodb+srv://kvpatel0701:kvpatel0701@mern-estate.omyvru1.mongodb.net/mern-estate?retryWrites=true&w=majority'

app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3030, () => {
  console.log("App is running on port 3030.");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

app.use(express.static(path.join(_dirname,'/client/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(_dirname, 'client','dist','index.html'));
});

app.use((err, req, res,next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
