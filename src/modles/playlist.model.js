import mongoose ,{Schema} from "mongoose";

const playlistSchema =new  mongoose.Schema({
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
,{Timestamp:true})

export const Playlist =mongoose.model("Playlist",playlistSchema)