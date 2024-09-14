
import mongoose , {Schema}from "mongoose";

const LikeSchema = mongoose.Schema({
    video:{
        type :Schema.Types.objectId,
        ref :"video"

    },
    
    comment:{
        type :Schema.Types.objectId,
        ref :"comment"

    },
    
    tweet:{
        type :Schema.Types.objectId,
        ref :"tweet"

    },
    likedBy:{
        type :Schema.Types.objectId,
        ref :"User"

    },
    
})

export const likes = mongoose.model("like",LikeSchema)