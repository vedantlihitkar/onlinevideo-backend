
import mongoose , {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    username :{
        type : String,
        required : true,
        unique : true,
        lowecase : true,
        trim :true,
        index : true
    },
    emial :{
        type : String,
        required : true,
        unique : true,
        lowecase : true,
        trim :true
        
    },
    fullname :{
        type : String,
        required : true,
        trim :true,
        index : true
    },
    avatar :{
        type : String,
        required : true,
        unique : true,
    },
    coverImage :{
        type : String,
        
    },
    watchHistory :[
        {
            type :Schema.Types.ObjectId ,
            ref : "video"
        }
    ],
    password :{
        type : String,
        required :[true ,"password is required"]
    },
    refreshToken :{
        type : string 

    }
},{timestamps : true})

userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next()
    this.password =bcrypt.hash(this.password,10)
    next()
})


export const User = mongoose.model("User",userSchema)