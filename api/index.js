import authRouter from './routes/auth.route';

const express = require('express');
const mongoose = require('mongoose')
const dotenv = require('dotenv')

const app =express();

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


// app.use('/api/user',userRouter)
app.use('/api/auth',authRouter)