import mongoose ,{Schema, schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentsSchema =mongoose.schema({
    content :{
        type : String,
        required : true,
    },
    video:{
        type :Schema.Types.objectId,
        ref :"video"

    },
    owner:{
        type :Schema.Types.objectId,
        ref :"User"

    }
    
},{Timestamp :true})

commentsSchema.plugin(mongooseAggregatePaginate)

export const Comment =mongoose.model("comment",commentsSchema)