 //require('dotenv').config({path:"./env"})

// import mongoose, { connect } from "mongoose";
// import {DB_NAME} from "./constants";

import dotenv from "dotenv" ;
import connectDB from "./DB/db.js";
import { app } from "./app.js";

dotenv.config({
    path: './.env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000 ,()=>{
        console.log(`server is running at port : ${process.env.PORT}`);
    })
})
.catch((error) =>{
    console.log("mongo db connection failed ", error);
})








/*    this part of code is first approach where we connect database in index.js file itself bur better approach is to make an seprate folder for database connectivity and export it in index.js


import mongoose from "mongoose"
// import {DB_NAME} from "./constants";

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

*/