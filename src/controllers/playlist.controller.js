import { asynchandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/apiresponse.js";
import { apierror } from "../utils/apierror.js";
import mongoose from "mongoose";
import { Playlist } from "../modles/playlist.model.js";
import { User } from "../modles/user.model.js";



const createPlaylist= asynchandler(async(req ,res)=>{

// name ,description user se lenge
// playlist banayge create method se

const {name , description  } = req.body

if(!(name && description)){
    throw new apierror(400,"fields are required")
}


const createPlaylist = await Playlist.create({
    name,
    description : description,
    owner: new mongoose.Types.objectId(req.user._id)
  });
  
if (!createPlaylist) {
    throw new apierror(400,"playlist cannot be created try again")
    
}


return res
.status(200)
.json(
     new ApiResponse(200,createPlaylist,"playlist created successfully")
)

})





const getUserPlaylists = asynchandler(async (req, res) => {
    const {userId} = req.params;

    //TODO: get user playlists  

if(!userId){
    throw new apierror(400 ,"cannot find user")
}

const getPlaylists = await Playlist.find({ owner :userId });

if (!getPlaylists || getPlaylists.length === 0) {
   throw new apierror(404 , "cannot find playlist")
}


    return res
    .status(200)
    .json(
        new ApiResponse(200,getPlaylists,"user playlist fetched successfully")
    )

})




const getPlaylistById = asynchandler(async (req, res) => {
    //TODO: get playlist by id
    //get playlist or video id from url
    // find the playlist from the given id
    //check if loggedin user is adding video to playlist
    //check if video already present
    // add that video to playlist from id
    
    const {playlistId} = req.params
    if (!playlistId) {
        throw new apierror(401 ,"cannot find playlist")
    }

  const  getPlaylists= await Playlist.findById(playlistId)


    if (!getPlaylists) {
        throw new apierror(401,"cannot get playlist")
        
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,getPlaylists,"playlist fetched")
    )
})







const addVideoToPlaylist = asynchandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if (!(playlistId && videoId)) {
        throw new apierror(404 ,"invalid user playlist or video id")
        
    }

const getPlaylist = await Playlist.findById(playlistId)

if(!getPlaylist){
    throw new apierror(401,"cant get playlist")
}

if (getPlaylist.owner.equal(req.user?._id)) {
    throw new apierror(400 , "you cant update the playlist")
}

if (getPlaylist.video.includes(videoId)) {
    throw new apierror(400 ,"video is already in playlist")
}


getPlaylist.push(videoId)

const videoAdded =await getPlaylist.save()

if (!videoAdded) {
    throw new apierror(400 ,"cannot add this video try again")
    
}

return res
.status(200)
.json(
    new ApiResponse(200,videoAdded,"video added successfully")
)

})



const removeVideoFromPlaylist = asynchandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
if (!(playlistId && videoId)) {
    throw new apierror(401 ,"Invalid playlist or video ID")
    
}


const findPlaylist = await Playlist.findOne(
   { $and:[
    {_id : playlistId},
    {video :videoId },
   ]}
)

if (!findVideo) {
    throw new apierror(400,"playlist not found")
    
}

if ( !findVideo.owner.equals( req.user?._id ) )
     { throw new apierror( 400, "You can't update this playlist!" ); }


findPlaylist.video.pull(videoId)

const videoRemoved =await findPlaylist.save()

if (!videoRemoved) {
    throw new apierror(400,"cant remove video from playlist try again later")
    
}


return res
.status(200)
.json(
    new ApiResponse(200 ,videoRemoved,"video removed successfully"))
})





const deletePlaylist = asynchandler(async (req, res) => {
    //todo - id lege , dhundege , delete kar dege 
    const {playlistId} = req.params


    if (!playlistId) {
        throw new apierror(401 , "invalid playlistID")
        
    }
    
    
    
    const findPlaylist = await Playlist.findById({_id : playlistId})
    
    if (!findPlaylist) {
        throw new apierror(400 ,"cannot find playlist")
        
    }
    if ( !findPlaylist.owner.equals( req.user?._id ) )
        { throw new apierror( 400, "You can't update this playlist!" ); }
   
    const playlistDelete =await Playlist.findByIdAndDelete(playlistId)

if (!playlistDelete) {
throw new apierror(400,"cant delete playlist try again later ")
    
}

    return res
    .status(200)
    .json(
         new ApiResponse(200 ,playlistDelete,"playlist delete successfully")
    )
    
    
})



const updatePlaylist = asynchandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: check karege playlist , current user=playlist owner , then update


if (!(playlistId && name && description)) {
    throw new apierror(400 ,"please enter the credentials ")
}

const findPlaylist = await Playlist.findById(playlistId)

if (!findPlaylist) {
    throw new apierror(400,"cannot find playlist")
    
}


if ( !findPlaylist.owner.equals( req.user?._id ) )
    { throw new apierror( 400, "You can't update this playlist!" ); }

const updatedplaylist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
        $set: {
            name: name,
            description: description
        }
    },
    { new: true } 
)

if (!updatedplaylist) {
    throw new apierror(400,"cannot update playlist")
    
}
return res
.status(200)
.json(
    new ApiResponse(200,updatedplaylist,"your playlist updated successfully")
)

})









export{
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}