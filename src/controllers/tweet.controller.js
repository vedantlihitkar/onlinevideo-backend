import mongoose ,{isValidObjectId} from "mongoose";
import { asynchandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/apiresponse.js";
import { apierror } from "../utils/apierror.js";
import { tweet } from "../modles/tweet.model.js";
import { User } from "../modles/user.model.js";


const createTweet = asynchandler(async (req, res) => {
    //TODO: create tweet
    const {content} =req.body
    if (!content) {
        throw new apierror(400,"content is required")
    }

    const postTweet =await tweet.create({
        owner : req.user._id,
        content :content
    })
if (!postTweet) {
    throw new apierror(400,"cannot create tweet try again later")
}
return res
.status(200)
.json(
    new ApiResponse(200,postTweet,"tweet created")
)

})

const getUserTweets = asynchandler(async (req, res) => {
    // TODO: get user tweets

})

const updateTweet = asynchandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId}= req.params
    const {content} =req.body
    if (!isValidObjectId(tweetId)) {
        throw new apierror(400,"invalid tweetId")
    }
    if (!content) {
        throw new apierror(400,"content is required")

    }

const findTweet =await tweet.findOne({
    $and:[{owner : new mongoose.Types.ObjectId( req.user?._id )},{_id :tweetId}]
})

if (!findTweet) {
    throw new apierror(400,"no tweet found")
}

findTweet.content = content
    const updatedTweet = await findTweet.save()

    if ( !updatedTweet ) { throw new apierror( 500, "Tweet not updated!" ) }

    return res.status( 200 )
        .json( new ApiResponse( 200, updatedTweet, "Tweet updated successfully" ) )


})

const deleteTweet = asynchandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId}= req.params
    if (!isValidObjectId(tweetId)) {
        throw new apierror(400,"invalid tweetId")
    }

    const findTweet =await tweet.findOne({
        $and:[{owner : new mongoose.Types.ObjectId( req.user?._id )},{_id :tweetId}]
    })
    
    if (!findTweet) {
        throw new apierror(400,"no tweet found")
    }

    const tweetDelete = await tweet.findByIdAndDelete({tweet :tweetId})
    if(!tweetDelete){throw new apierror(400,"cannot del tweet try again")}

    return res
    .status(200)
    .json(
        new ApiResponse(200,tweetDelete,"tweet delete successfully")
    )

})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}