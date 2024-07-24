// require('dotenv').config({path:"./env"})

// import mongoose, { connect } from "mongoose";
// import {DB_NAME} from "./constants";
import dotenv from "dotenv"
import connectDB from "./DB/db.js";


dotenv.config({
    path: './env'
})

connectDB()

            


import express from "express"
const app = express()

(async ()=>{
    try{
    await mongoose.connect(`${process.env.MONGO_DB}/${DB_NAME}`)
    app.on("error",(error)=>{
        console.log("error",error);
        throw error
    })

    app.listen(process.env.PORT, () => {
        console.log(`Example app listening on port ${process.env.PORT}`)
      })

    }catch(error){
console.log("error :",error)
throw err
    }
})()
    
