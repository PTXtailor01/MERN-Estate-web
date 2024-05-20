import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js'
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'

const app =express();

app.use(express.json());

dotenv.config();
mongoose
    .connect(process.env.MONGO)
    .then(()=>{
        console.log("Connected to mongodb")
    })
    .catch((err)=>{
        console.log(err)
    })

app.listen(3030 , ()=>{
    console.log("App is running on port 3030.")
})


app.use('/api/user',userRouter)
app.use('/api/auth',authRouter)