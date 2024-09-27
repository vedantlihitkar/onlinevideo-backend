import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../modles/like.model.js";
import { asynchandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/apiresponse.js";
import { apierror } from "../utils/apierror.js";


const toggleVideoLike = asynchandler(async (req, res) => {
    //TODO: toggle like on video
    const {videoId} = req.params
if (isValidObjectId(videoId)){
    throw new apierror(400,"invalid video id")
}

const videoLiked =await Like.findOne({
   $and:[
    {likedBy :req.user?._id} ,{ video :videoId}
    
        ]
})

if (videoLiked) {
    const unLikeVideo = await Like.findByIdAndDelete(videoLiked._id)

    return res
    .status(200)
    .json(
        new ApiResponse(200,unLikeVideo,"video unliked")
    )
}


const likeVideo =Like.create({
    likedBy :req.user?._id,
    video :videoId
})

return res
.status(200)
.json(
    new ApiResponse(200,likeVideo,"video liked")
)

})


const toggleCommentLike = asynchandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    if (isValidObjectId(commentId)){
        throw new apierror(400,"invalid comment id")
    }
    
    const commentLiked =await Like.findOne({
       $and:[
        {likedBy :req.user?._id} ,{ comment :commentId}
        
            ]
    })
    
    if (commentLiked) {
        const unlikeComment = await Like.findByIdAndDelete(commentLiked._id)
    
        return res
        .status(200)
        .json(
            new ApiResponse(200,unlikeComment,"comment unliked")
        )
    }
    
    
    const likeComment =Like.create({
        likedBy :req.user?._id,
        comment :commentId
    })
    
    return res
    .status(200)
    .json(
        new ApiResponse(200,likeComment,"comment liked")
    )
    
    

})

const toggleTweetLike = asynchandler(async (req, res) => {
    //TODO: toggle like on tweet
    const {tweetId} = req.params
    if (!isValidObjectId(tweetId)) { throw new apierror(401,"invalid id")
        
    }

const iftweetLiked =await Like.findOne({
    $and :[
        {likedBy : req.user._id},
        {tweet :tweetId}
    ]
})

if (iftweetLiked) {
    const unlikeTweet =await Like.findByIdAndDelete(iftweetLiked._id )

return res
.status(200,unlikeTweet,"tweet unliked")


}

const likeTweet = await Like.create({
    likedBy:req.user?._id,
    tweet :tweetId,
})

return res
.status(200)
.json(
    new ApiResponse(200,likeTweet,"tweet liked")
)

})





const getLikedVideos = asynchandler(async (req, res) => {
    //TODO: get all liked videos
    const likedVideos = await Like.find({
        $and:[
            {likedBy : req.user?._id},

            {video :videoId}
        ]
    })
    if (!likedVideos) {
        throw new apierror(401,"no liked videos")
        
    }

return res
.status(200)
.json(
    new ApiResponse(200,likedVideos,"liked video fetched successfully")
)

})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}