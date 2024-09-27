import mongoose, {isValidObjectId} from "mongoose";
import { User } from "../modles/user.model.js";
import { ApiResponse } from "../utils/apiresponse.js";
import { apierror } from "../utils/apierror.js";
import { Subscription } from "../modles/subscription.model.js";
import { asynchandler } from "../utils/asynchandler";
import { isValidObjectId } from "mongoose";



const toggleSubscription = asynchandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    if (!isValidObjectId(channelId)) {
        throw new apierror(401 ,"invalid id")
    }
    const channelSubscribed = await Subscription.findOne({
        $and :[{
            SubscribedBy : req.user._id 

        },{
            channel :channelId
        }
    ]
    })
    
    if (channelSubscribed) {
        const unSubscribe = await Subscription.findByIdAndDelete(channelSubscribed.req.user._id);
        return res 
        .status(200)
        .json(
            new ApiResponse(200,unSubscribe,"channel unsubscribe")
        )
    }
    
const subscribeChannel =Subscription.create({
    SubscribedBy :req.user._id,
    channel :channelId
})

   return res
   .status(200)
   .json(
    new ApiResponse(200,subscribeChannel,"channel subscribed")
   )
    
    
})


// controller to return subscriber list of a channel
const getUserChannelSubscribers = asynchandler(async (req, res) => {
    const {channelId} = req.params


if(!isValidObjectId(channelId)){throw new apierror(400 ,"invalid channel id")}

// const subscriber = await Subscription.findOne({
//     $and :[{
        
//     }]
//})

const subscribers = await Subscription.find({
    channel: channelId 
}).populate('subscriber', 'channel');

if (!subscribers) {
    return res 
    .status(200)
    .json(
        new ApiResponse(404,{},"no subscribers")
    )
}


return res
.status(200)
.json(
    new ApiResponse(200 ,subscribers,"subscribers :")
)

})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asynchandler(async (req, res) => {
    const { subscriberId } = req.params
    if(!isValidObjectId(subscriberId)){throw new apierror(401 ,"invalid subscriber ID")}

    const subscriptions = await Subscription.find({
        subscriber: req.user._id
    }).populate('channel', 'name description'); 

    if (!subscriptions.length) {
        return res.status(404).json(
            new ApiResponse(404 ,"no subscriber found")
        )
    
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,subscriptions,"subscribed to :")
    )

})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}