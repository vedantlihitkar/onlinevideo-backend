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

     const {fullName, email ,username,password} = req.body
     console.log("email: ", email);

    // if(fullName===""){
    //     throw new apierror(
    //         400,"fullname is required")
    // }

    if (
        [fullName ,email,username,password].some((field)=>field?.trim()==="")
    ) {
        throw new apierror(
        400,"all fields are required")
    }


   const existedUser = User.findOne({
        $or :[{username} , {email} ]
    })

if (existedUser) {

    throw new apierror(409 ,"user already exist")
}


// multer provide acces to files
const avatarLocalPAth =req.files?.avatar[0]?.path;

const coverimageLocalPAth =req.files?.coverimage[0]?.path

if (!avatarLocalPAth) {
 throw new apierror(400 , "avatar files required")   
}


const avatar =await uploadCloudinary(avatarLocalPAth)
const coverImage =await uploadCloudinary(coverimageLocalPAth)

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