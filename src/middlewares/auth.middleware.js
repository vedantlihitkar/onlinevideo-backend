import { apierror } from "../utils/apierror.js";
import { asynchandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken"
import { User } from "../modles/user.model.js";


// check is user exist or not


export const verifyjwt =asynchandler(async(req , res , next)=>{

   try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("bearer","")
 
 if (!token) {
     throw new apierror(401,"unauthorized request")
 }
 const decodedToken =jwt.verify(token ,process.env.ACCES_TOKEN_SECRET)
 const user =await User.findById(decodedToken?._id).select("-password -refreshToken")
 
 if (!user) {
     throw new apierror(401 ,"invalid access token")
 }
 
 req.user =user ;
 next()

 // we have created a middleware specially for handling routes for logout

   } 
   
   catch (error) {
    throw new apierror(401 ,"invalid access token")
   }



})