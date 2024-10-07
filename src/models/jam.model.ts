import mongoose, {Types, Document, Schema} from "mongoose";
import { USER_TYPE } from "../config/appConstant";
import { JamDocument } from "../interfaces/jam.interface";
import { string } from "joi";

const jamSchema = new Schema<JamDocument>(
    {
       user:{
        type: Schema.Types.ObjectId, ref: 'users' 
       },
       jamName:{
        type:String
       },
       date:{
        type:Date
       },
       time:[{
        startTime:{
        type:String
        },
        endTime:{
        type:String
        },
       }],
       genre:{
        type:String
       },
       repertoire:{
        type:String
       },
       bandFormation: [{
        type:String
       }],
       city:{
        type:String
       },
       region:{
        type:String
       },
       landmark:{
        type:String
       },
       description:{
        type:String
       },
       qrCode: {
        type: String
       },
       members:[{
       type: Schema.Types.ObjectId, ref: 'users' 
       }],
       allowMusicians:{
        type:Boolean
       },
       notifyFavMusicians:{
        type:Boolean
       },
       isDeleted:{
        type:Boolean,
        default:false
       }
      },
      { timestamps: true }
)

const Jam = mongoose.model<JamDocument>("jams", jamSchema)

jamSchema.index({ loc: "2dsphere" });

export default Jam