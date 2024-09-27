import mongoose , {Schema}from "mongoose";

const tweetSchema =new mongoose.Schema({
    content :{
        type : String,
        required : true,
    },
    owner:{
        type:Schema.Types.objectId,
        ref :"User"
    }

},{Timestamps:true})

export const tweet = mongoose.model("tweet",tweetSchema)