  import { Document, Schema, Types, ObjectId } from "mongoose";

export interface JamDocument extends Document {
    user: Schema.Types.ObjectId,
    jamName:string,
    date:Date,
    time: object[],
    genre:string,
    repertoire:string,
    bandFormation:string[],
    city:string,
    region:string,
    landmark:string,
    description:string,
    qrCode:string,
    members:ObjectId[],
    allowMusicians:boolean,
    notifyFavMusicians:boolean,
    isDeleted:Boolean
}
