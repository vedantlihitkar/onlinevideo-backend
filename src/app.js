import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"

const app = express()

app.use(cors({
    origin : process.env.cors_origin ,
    crediantials : true 
}
))
app.use(express.json({limit :"16kb"}))
app.use(express.urlencoded({extended :true , limit : "16kb"}))
app.use(express.static("public")) //file ya kuch save karna ho to public folder me save hoga
app.use(cookieParser())


//routes import

import userRouter from './routes/user.route.js'
import commentRouter from "./routes/comments.route.js"
import playlistRouter from "./routes/playlist.routes.js"
import likeRouter from "/routes/like.route.js"





//routes declaration

app.use("/api/v1/users",userRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/likes",likeRouter)


// http://localhost:8000/users/register

export { app } 