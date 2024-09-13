import { Router } from "express";
import { loginUser, LogoutUser, registerUser ,refreshAccessToken, changeCurrentPassword, getcurrentUser, updateAccountDetail, updateUserAvatar, updateUserCoverImage, getUserChannel, getWatchHistory} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyjwt } from "../middlewares/auth.middleware.js";



const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name :"avatar",
            maxCount :1
        },
        {
            name :"coverimage",
            maxCount :1
        }
    ]),

    registerUser
)

router.route("/login").post(loginUser)


router.route("/logout").post(verifyjwt , LogoutUser)

router.route("/refresh-token").post(refreshAccessToken)

router.route("./change-password").post(verifyjwt,changeCurrentPassword)

router.route("./current-user").get(verifyjwt,getcurrentUser)

router.route("./update-user").patch(verifyjwt,updateAccountDetail)

router.route("./update-avatar").patch(verifyjwt, upload.single("avatar"),    updateUserAvatar)

router.route("./update-coverimage").patch(verifyjwt,  upload.single("coverImage"), updateUserCoverImage)

router.route("/c/:username").get(verifyjwt,getUserChannel)

router.route("./history").get(verifyjwt,getWatchHistory)

export default router 

