import { asynchandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/apiresponse.js";
import { apierror } from "../utils/apierror.js";
import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { Comment } from "../modles/comments.model.js";



const getVideoComments = asynchandler(async (req, res) => {
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

if (!videoId) {
    throw new apierror(400,"invalid video Id")
}
const pageNumber = parseInt(page, 10);
const limitNumber = parseInt(limit, 10);
const skip = (pageNumber - 1) * limitNumber;

const comments = await Comment.aggregate([
    {
        $match: {videoId: mongoose.Types.ObjectId( videoId ) }  // Matching the videoId field
    },
    {
        $skip: skip  // Skipping to the right page
    },
    {
        $limit: limitNumber  // Limiting the number of results
    },
    {
        $sort: { createdAt: -1 }  // Sorting by creation date (newest first, if needed)
    }
]);

if (comments.length === 0) {
    throw new apierror(400, "No comments available yet");
}
return res
.status(200)
.json(
    new ApiResponse(200,comments,"comments fetched successfully")
)
})



const addComment = asynchandler(async (req, res) => {
    const{videoId}=req.params
const {content} = req.body


if (!videoId) {
    throw new apierror(400,"invalid video ID")
}


if (!content) {
    throw new apierror(400,"this field cannot be empty")
    
}

const commentAdd = Comment.create({
    content : content ,
    video : videoId,
    owner : new mongoose.Types.objectId(req.user._id)

})


if (!commentAdd) {
    throw new apierror(401,"cant add comment try again later")
    
}

return res 
.status(201)
.json(
    new ApiResponse(201 ,commentAdd ,"comment added successfully")
)

})


const updateComment = asynchandler(async (req, res) => {
    // TODO: update a comment
    const{videoId}=req.params
    const {content} = req.body
    
    
    if (!videoId) {
        throw new apierror(400,"invalid video ID")
    }
    
    
    if (!content) {
        throw new apierror(400,"this field cannot be empty")
        
    }
const comment = await Comment.findOne({
    video :videoId,
    owner:req.user._id
})

if (!comment) {
    throw new apierror(400,"cannot find comment")
    
}

comment.content =content 

await comment.save()

return res
.status(200)
.json(
    new ApiResponse(200,comment,"comment updated successfully")
)

})


const deleteComment = asynchandler(async (req, res) => {
    // TODO: delete a comment
    const{videoId}=req.params

    if (!videoId) {
        throw new apierror(400,"invalid video ID")
    }

    const delComment = await Comment.deleteOne({
       $and:[{video :videoId},
       { owner:req.user._id}
    
    ]
    })
    
if (!delComment) {
    throw new apierror(401,"cont find comment")
    
}

return res.status(200)
.json(
    new ApiResponse(200,delComment,"comment delete successfully")
)


})


export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }