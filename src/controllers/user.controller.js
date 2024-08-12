import { asynchandler } from "../utils/asynchandler.js";
import { apierror } from "../utils/apierror.js";
import { User } from "../modles/user.model.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiresponse.js";
import { json } from "express";

const registerUser = asynchandler (async (req , res )=>{
    // ({
    // res.status(200).json
    //     message :"ok hello"
    // })
//data points extract karage req.body me se
  const {fullName, email ,username,password} = req.body
  
  
  
  
     //  console.log("username: ", username);
    //  console.log("fullname: ", fullName);
    //  console.log("email: ", email);
     
    // if(fullName===""){
    //     throw new apierror(
    //         400,"fullname is required")
    // }

//CHECK KARGE KE VO DATA POINTS EMPTY HAI KE NHI

    if (
        [fullName ,email,username,password].some((field)=>field?.trim()==="")
    ) {
        throw new apierror(
        400,"all fields are required")
    }

//CHECK IF USER EXIST OR NOT
   const existedUser =await User.findOne({
        $or :[{username} , {email} ]
    })

if (existedUser) {

    throw new apierror(409 ,"user already exist")
}


// multer provide acces to files

//console.log(req.files);

// AVATAR KA LOCAL PATH NKLALA TAKI PHIR CLOUDINARY PE UPLOAD KAR SAKE 
const avatarLocalPath = req.files?.avatar?.[0]?.path;
const coverimageLocalPath = req.files?.coverimage?.[0]?.path;


if (!avatarLocalPath) {
 throw new apierror(400 , "avatar files required")   
}

// CLOUDINARY PE UPLOAD KAREGE 
const avatar =await uploadCloudinary(avatarLocalPath)
const coverImage =await uploadCloudinary(coverimageLocalPath)

if (!avatar) {
    throw new apierror(400 , "avatar files required")  
}

//create a user object entryy in db
const user = await User.create({
    fullName,
    avatar : avatar.url,
    coverImage :coverImage?.url || "",
    email,
    password,
    username :username.toLowerCase()
})


const CreatedUser =await User.findById(user._id).select(
    "-password -refreshToken"
)

if (!CreatedUser) {
    throw new apierror(500 , "something went wrong ")

}

return res.status(201).json(
   new ApiResponse (200,CreatedUser,"user register succesfully")
)




})

export {registerUser}