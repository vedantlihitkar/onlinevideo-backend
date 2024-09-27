import { Router } from "express";
import { verifyjwt } from "../middlewares/auth.middleware.js";
import{toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos} from "../controllers/like.controller.js"



const router =Router()


app.use(verifyjwt)


router.route("/toggle/v/:videoId").post(toggleVideoLike);
router.route("/toggle/:commentId").post(toggleCommentLike)
router.route("/toggle/:tweetId").post(toggleTweetLike)
router.route("/LikedVideos/:userId").get(getLikedVideos)


export default router