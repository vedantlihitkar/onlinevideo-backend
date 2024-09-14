import mongoose , {Schema}from "mongoose";

const playlistSchema = mongoose.Schema({
    name :{
    type :String,
    required :true
    },
    description :{
        type :String,
        required : true
    },
    videos:[
        {
        type :Schema.Types.objectId,
        ref :"video"
        }
    ],

    owner:{
        type:Schema.Types.objectId,
        ref :"User"
    }
}
,{Timestamps:true})

export const playlist =mongoose.modell("playlist",playlistSchema)