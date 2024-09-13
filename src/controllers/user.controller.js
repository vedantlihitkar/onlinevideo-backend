import { asynchandler } from "../utils/asynchandler.js";
import { apierror } from "../utils/apierror.js";
import { User } from "../modles/user.model.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiresponse.js";
import { json } from "express";
import jwt from "jsonwebtoken"
import { ReturnDocument } from "mongodb";
import mongoose from "mongoose";

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


const changeCurrentPassword =asynchandler(async(req ,res)=>{
    const{oldPassword ,newPassword} = req.body
    const user =await User.findById(req.user?._id)
    const isPasswordCorrect =await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new apierror(400,"invalid old password")
    }

    user.password =newPassword
   await user.save({ValidateBeforeSave :false})

return res 
.status(200)
.json(new ApiResponse(200,{},"password changed successfully"))


})



const getcurrentUser =asynchandler(async(req , res)=>{

    return res
    .status(200)
    .json(200 ,req.user ,"current user fetched successfully")

})


const updateAccountDetail = asynchandler(async(req , res )=>{

    const {fullName ,email}=req.body

    if(!(fullName || email)){
        throw new apierror(401 , "All field are required")
    }


const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
        $set :{
            fullName :fullName ,
            email :email
        }
    },
    {new :true}
).select("-password")

return res 
.status(200)
.json(
    new ApiResponse(200 ,user,"account details updated successfully"))



})


const updateUserAvatar = asynchandler(async(req , res)=>{
   const avatarLocalPath = req.file?.path
if (!avatarLocalPath) {
    throw new apierror(400 ,"avatar file is missing")

}
const avatar = await uploadCloudinary(avatarLocalPath)

if (!avatar.url) {
    throw new apierror(400 ,"error while uploading  avatar ")
}

const user =await User.findByIdAndUpdate(
    req.user?._id,
    {
        $set :{
           avatar :avatar.url
        }
    },
    {new :true}
).select("-password")

return res
.status(200)
.json(
    new ApiResponse(200 , user , "avatar update successfully")
 )

})


const updateUserCoverImage = asynchandler(async(req , res)=>{
   const coverimageLocalPath = req.file?.path
if (!coverimageLocalPath) {
    throw new apierror(400 ,"cover image file is missing")

}
const coverImage = await uploadCloudinary(coverimageLocalPath)

if (!coverImage.url) {
    throw new apierror(400 ,"error while uploading cover image ")
}

const user =await User.findByIdAndUpdate(
    req.user?._id,
    {
        $set :{
           coverImage :coverImage.url
        }
    },
    {new :true}
).select("-password")

return res
.status(200)
.json(
    new ApiResponse(200 , user , "cover image update successfully")
 )

})




const getUserChannel =asynchandler(async(req , res)=>{
    
    //kisi channel chaiye to uski url pe jate hai  soo we need username from that url
const {username} = req.params
//To destructure the username directly from req.params:


//const username = req.params
//If you want to assign the entire req.params to a variable named username, this will overwrite the username parameter with the entire req.params object:


if (!username?.trim()) {
    throw new apierror(400 , "username not found")
}


const channel =await User.aggregate([
    //user ko match kiya 
    {
        $match:{
            username : username?.toLowerCase()
        }
    },
    {
        $lookup:{
            from :"subscription",
            localField :"_id",
            foreignField:"channel",
            as :"subscribers"

        }
    },
    {
        $lookup:{
            from :"subscription",
            localField :"_id",
            foreignField:"subscriber",
            as :"subscribedTo"
        }
    },
    {
        $addFields:{
            subscriberCount:{
                $size:"$subscriber"
            },
            channelsSubscribedToCount :{
                $size :"$subscribedTo"
            },
            isSubscribed :{
                $cond :{
                    if:{$in:[req.user?._id,"$subscribers.subscriber"]},
                    then :true,
                    else :false
                }
            }
        }
    },
    {
        //$project give a projection to user that it will give selected things
        $project:{
        fullName :1,
        username:1,
        subscriberCount:1,
        channelsSubscribedToCount :1,
        isSubscribed :1,
        coverImage:1,
        email:1,
        avatar:1
                 }
    }
])

if (!channel?.length) {
    throw new apierror(404,"channel does not exist")
}

return res
.status(200)
.json(
    new ApiResponse(200, channel[0],"user channel fetched successfully")
)


})


const getWatchHistory =asynchandler(async(req , res)=>{
 const user = await User.aggregate([
    {
        $match :{
            _id : new mongoose.Types.ObjectId(req.user._id)
        }
    },
    {
        $lookup :{
            from :"video",
            localField :"watchHistory",
            foreignField :"_id",
            as :"watchHistory",
            pipeline:[
                {
                    $lookup :{
                        from :"user",
                        localField :"owner",
                        foreignField :"_id",
                        as :"owner",
                        pipeline :[
                            {
                                $project:{
                                    fullName :1,
                                    username :1,
                                    avatar:1
                                    
                                }
                            }
                            
                        ]
                    }
                },
                {
                    $addFields :{
                        owner:{
                            $first :"$owner"
                        }
                    }
                }
            ]
        }
    }
 ])
 return res
 .status(200)
 .json(
    new ApiResponse(200,user[0].watchHistory,"watch history fetched successfully")
 )
})




export {registerUser,
  loginUser,
    LogoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getcurrentUser,
    updateAccountDetail,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannel,
    getWatchHistory

}