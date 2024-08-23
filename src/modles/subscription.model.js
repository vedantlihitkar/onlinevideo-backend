import mongoose , {Schema} from "mongoose";

const subscriptionSchema = new mongoose.Schema({

 subscriber :{
    type : Schema.Types.ObjectI,
    ref :"User"
 },
 channel :{
    type : Schema.Types.ObjectI,
    ref :"User"
 }


},{timestamps :true}) 




export const Subscription = mongoose.model("Subscription",subscriptionSchema)