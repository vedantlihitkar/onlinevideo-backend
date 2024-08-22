import { asynchandler } from "../utils/asynchandler.js";
import { apierror } from "../utils/apierror.js";
import { User } from "../modles/user.model.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiresponse.js";
import { json } from "express";
import jwt from "jsonwebtoken"
import { ReturnDocument } from "mongodb";

const generateAccesAndRefreshToken = async(userId)=>{
    try {
       const user= await User.findById(userId)
       const accessToken=  user.generateAccesToken()
       const refreshToken=  user.generateRefrehToken()

user.refreshToken = refreshToken
await user.save({ValidateBeforeSave :false})

return { accessToken, refreshToken}

    } catch (error) {
        throw new apierror (500,"something went wrong while generating access and ref token")
    }
}




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





const loginUser =asynchandler(async(req, res)=>{
    /*
    //to do for login
 1.check if username / email is registered 
 2.check if password is correct 
 3.access and refresh token generate kar ke user ko bhejunga
 4 in token to cookies ke form me , send cookies
*/



const {email,username,password} = req.body

if (!(username || !email)) {
    throw new apierror (400 , "username or password is required")
    
}


const user =await User.findOne({
    $or :[{username} , {email} ]
})

if (!user) {
    throw new apierror(404 , "user does not exist")
    
}

const isPasswordValid =await user.isPasswordCorrect(password)

if (!isPasswordValid) {
    throw new apierror(401 , "wrong password")
    
}

 const {accessToken,refreshToken} =await generateAccesAndRefreshToken(user._id)

const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

//cookies bhejne ke liye security optionss , option is just an object 
const options ={
    httpOnly :true,
    secure :true
}


return res
.status(200)
.cookie("accessToken",accessToken,options)
.cookie("refreshToken",refreshToken,options)
.json(
    new ApiResponse(200,{
        user : loggedInUser,accessToken,refreshToken
    },
"user loggedin succesfully")
)
})



// log out user 

const LogoutUser =asynchandler(async(req , res)=>{
await User.findByIdAndUpdate(
    req.user._id ,{
       // $set is an mongodb operator
        $set :{
            refreshToken :undefined
        }
    },
    {
        new :true
    }
)
const options ={
    httpOnly :true,
    secure :true
}

return res
.status(200)
.clearCookie("accessToken",options)
.clearCookie("refreshToken",options)
.json(new ApiResponse(200,"user loggedout successfully"))
})



const refreshAccessToken = asynchandler(async(req , res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

if (!incomingRefreshToken) {
    throw new apierror(401,"unauthoried request");
}

try {
    const decodedToken =jwt.verify(incomingRefreshToken ,process.env.REFRESH_TOKEN_SECRET)
    
    const user =await User.findById(decodedToken?._id)
    
    if (!user) {
        throw new apierror(401," invalid refresh token ");
    }
    
    if (incomingRefreshToken !== user?.refreshToken) {
        throw new apierror(401," refresh token is expired ");
    }
    
    const option ={
        httpOnly:true,
        secure :true
    }
    
    const {accessToken , newrefreshToken}= await generateAccesAndRefreshToken(user._id)
    
    return res
    .status(200)
    .cookie("accessToken",accessToken , option)
    .cookie("refreshToken",newrefreshToken , option)
    .json(
        new ApiResponse(299,{accessToken , refreshToken :newrefreshToken}),
        "access token refreshed successfully"
    )
} catch (error) {
    throw new apierror(401 ,error?.message || "invalid refresh token")
}
})



export {registerUser,loginUser,LogoutUser,refreshAccessToken}