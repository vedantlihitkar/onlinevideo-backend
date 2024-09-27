import { asynchandler } from "../utils/asynchandler";
import { ApiResponse } from "../utils/apiresponse";
import { apierror } from "../utils/apierror";
import { Video } from "../modles/video.model.js";
import { isValidObjectId } from "mongoose";
import { uploadCloudinary } from "../utils/cloudinary.js";







const getAllVideos = asynchandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query

// this part i didnt understand so learn piplines well , and req.querry
// copied from gpt


   //TODO: get all videos based on query, sort, pagination)
    // 1. Get the page, limit, query, sortBy, sortType, userId from the request query(frontend) [http://localhost:8000/api/v1/video/all-video?page=1&limit=10&query=hello&sortBy=createdAt&sortType=1&userId=123]


    // 2. Get all videos based on query, sort, pagination)
    let pipeline = [
        {
            $match: {
                $and: [
                    {
                        // 2.1 match the videos based on title and description
                        $or: [
                            { title: { $regex: query, $options: "i" } },   // $regex: is used to search the string in the title "this is first video" => "first"  // i is for case-insensitive
                            { description: { $regex: query, $options: "i" } }
                        ]
                    },
                    // 2.2 match the videos based on userId=Owner
                    ( userId ? [ { Owner: new mongoose.Types.ObjectId( userId ) } ] : "" )  // if userId is present then match the Owner field of video 
                    // new mongoose.Types.ObjectId( userId ) => convert userId to ObjectId
                ]
            }
        },
        // 3. lookup the Owner field of video and get the user details
        {   // from user it match the _id of user with Owner field of video and saved as Owner
            $lookup: {
                from: "users",
                localField: "Owner",
                foreignField: "_id",
                as: "Owner",
                pipeline: [  // project the fields of user in Owner 
                    {
                        $project: {
                            _id: 1,
                            fullName: 1,
                            avatar: "$avatar.url",
                            username: 1,
                        }
                    }
                ]
            }
        },
        {
            // 4. addFields just add the Owner field to the video document 
            $addFields: {
                Owner: {
                    $first: "$Owner",  // $first: is used to get the first element of Owner array
                },
            },
        },
        {
            $sort: { [ sortBy ]: sortType }  // sort the videos based on sortBy and sortType
        }
    ];

    try
    {
        // 5. set options for pagination
        const options = {  // options for pagination
            page: parseInt( page ),
            limit: parseInt( limit ),
            customLabels: {   // custom labels for pagination
                totalDocs: "totalVideos",
                docs: "videos",
            },
        };

        // 6. get the videos based on pipeline and options
        const result = await Video.aggregatePaginate( Video.aggregate( pipeline ), options );  // Video.aggregate( pipeline ) find the videos based on pipeline(query, sortBy, sortType, userId). // aggregatePaginate is used for pagination (page, limit)

        if ( result?.videos?.length === 0 ) { return res.status( 404 ).json( new ApiResponse( 404, {}, "No Videos Found" ) ); }

        // result contain all pipeline videos and pagination details
        return res.status( 200 ).json( new ApiResponse( 200, result, "Videos fetched successfully" ) );

    } catch ( error )
    {
        console.error( error.message );
        return res.status( 500 ).json( new apierror( 500, {}, "Internal server error in video aggregation" ) );
    }

})




const publishAVideo = asynchandler(async (req, res) => {
    // TODO: get video, upload to cloudinary, create video
 try {
       const { title, description} = req.body
   
       if (
           [title , description].some((field)=>field?.trim()==="")
       )  {
           throw new apierror(
           400,"all fields are required")
       }
   
       
       const videoLocalPath =req.files?.Videofile[0]?.path
       const thumbnailLocalPath = req.files?.thumbnail[0]?.path
   
   
   
       if (!videoLocalPath) {
           throw new apierror(401,"please upload video")
           
       }
       
       
       if (!thumbnailLocalPath) {
           throw new apierror(401,"please upload thumbnail")
           
       }
       
       const VideoOnCloudinary = uploadCloudinary(videoLocalPath ,"video")
       const thumbnailOnCloudinary = uploadCloudinary(thumbnailLocalPath ,"img")
   
   if (!VideoOnCloudinary) {
       throw new apierror(400,"something went wrong while uploading video ")
   }
   if (!thumbnailOnCloudinary) {
       throw new apierror(400,"something went wrong while uploading thumbnail")
   }
   
   
       
       const publishVideo=await Video.create({
           video : VideoOnCloudinary?.url,
           thumbnail:thumbnailOnCloudinary?.url,
           title :title,
           description :description,
           owner : req.user?._id,
           videoduration :VideoOnCloudinary?.duration,
           isPublished :true,
           
       })
   
   if(!publishAVideo){
       throw new apierror(400 ,"cannot publish video try again later")
   }
       
       return res
       .status(200)
       .json(
           new ApiResponse(200 ,publishVideo,"published successfully")
       )
       
       
 } catch (error) {
    throw new apierror(401 , error?.message || "cannot upload video try again ")
 }
    
    
    
    
    
    
})



const getVideoById = asynchandler(async (req, res) => {
   try {
     const { videoId } = req.params
     //TODO: get video by id
     if(isValidObjectId(videoId)){throw new apierror(400,"invalid video id")}
 
     const video =await Video.findById(videoId)
 
     if (!video) {
         throw new apierror(400,"cannot find the video")
     }
 
 return res
 .status(200)
 .json(
     new ApiResponse(200,video,"successfully fetched video")
 )
   } catch (error) {
    throw new apierror(401,"something went wrong while fetching video from id")
   }


})


const updateVideo = asynchandler(async (req, res) => {
    //TODO: update video details like title, description, thumbnail
   try {
     const { videoId } = req.params
 
     if (!videoId) {
         throw new apierror(400 ,"invalid video ID")
     }
     const {title ,description}= req.body
     
     if ( [ title, description ].some( ( feild ) => feild.trim() === "" ) ) { throw new apierror( 400, "Please provide title, description, thumbnail" ) }
 
     const video = await Video.findById( videoId )
         if ( !video ) { throw new apierror( 400, "Video not found" ) }
 
 
 const thumbnailLocalPath =req.files?.thumbnail[0].path
 if ( !thumbnailLocalPath ) { throw new apierror( 400, "thumbnail not found" ) }
 const VideoThumnbailOnCloudinary = uploadCloudinary(videothumbnail ,"img")
 if ( !VideoThumnbailOnCloudinary ) { throw new apierror( 400, "thumbnail not uploaded on cloudinary" ) }
 
 
     const VideoUpdate =await Video.findByIdAndUpdate(
         {
         title :title,
         description :description,
         thumbnail : VideoThumnbailOnCloudinary?.url
 
     })
     
     if (!VideoUpdate) {
         throw new apierror(400 ,"cannot update try again alter")
     }
     const thumbnailOldUrl = video?.thumbnail
     const deleteThumbnailOldUrl = await deleteFromCloudinary( thumbnailOldUrl, "img" )
     if ( !deleteThumbnailOldUrl ) { throw new apierror( 400, "thumbnail not deleted" ) }  
     
     return res 
     .status(200)
     .json(
         new ApiResponse(200 , VideoUpdate,"video upload successfully")
     )
     
   } catch (error) {
    throw new apierror(40 ," error while updating video ")
   }
})
    
    
    
    
const deleteVideo = asynchandler(async (req, res) => {
    //TODO: delete video
    const { videoId } = req.params

if (!videoId) {
    throw new apierror(400 ,"invalid videoID")
}

const video =await Video.findById(videoId)
if ( !video.Owner.equals( req.user._id ) ) { throw new apierror( 403, "You are not authorized to delete this video" ); }

if (!video) {
    throw new apierror(400 ,"no such video")
}

const videoFile = await deleteFromCloudinary( video.videoFile, "video" )
const thumbnail = await deleteFromCloudinary( video.thumbnail, "img" )

if ( !videoFile && !thumbnail ) { throw new apierror( 400, "thumbnail or videoFile is not deleted from cloudinary" ) }

await video.remove();

return res
.status(200)
.json(
    new ApiResponse(200,video,"delete successfully")
)


})







const togglePublishStatus = asynchandler(async (req, res) => {
    const { videoId } = req.params

    if (!videoId) {
        throw new apierror(400 ,"invalid videoId")
    }
    const toggleisPublished = await Video.findOne(  
        {
            _id: videoId,     
            Owner: req.user._id, 
        },
    );

    if ( !toggleisPublished ) { throw new apierror( 400, "Invalid Video or Owner" ) }

    // 3. toggle the isPUblished field of the video document
    toggleisPublished.isPublished = !toggleisPublished.isPublished
    await toggleisPublished.save()

    return res.status( 200 )
        .json( new ApiResponse( 200, toggleisPublished.isPublished, "isPublished toggled successfully" ) )
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus

}







