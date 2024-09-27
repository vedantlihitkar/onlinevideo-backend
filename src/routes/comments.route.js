import { Router } from "express";
import { verifyjwt } from "../middlewares/auth.middleware.js";

import { getVideoComments, 
    addComment, 
    updateComment,
     deleteComment}
     from "../controllers/comments.controller.js";
import { verify } from "jsonwebtoken";

const router =Router()


router.use(verifyjwt);

router.route("/:videoId").get(getVideoComments).post(addComment);

router.route("/:commentId").delete(deleteComment).patch(updateComment);

export default router ;