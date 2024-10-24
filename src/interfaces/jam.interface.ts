import { Document, Schema, ObjectId } from "mongoose";
import { StringifyOptions } from "querystring";

export interface JamSlot {
  startTime: string;
  endTime: string;
}

export interface JamAvailableDate {
  date: Date;
  slots: JamSlot[];
}

export interface JamDocument extends Document {
  user: ObjectId; 
  jamName: string;
  availableDates: JamAvailableDate[]; 
  genre: string;
  repertoire: string[];
  commitmentLevel:string,
  image:string,
  bandFormation: [{
    instrument: string,
    type:string
  }];
  // city: string;
  // region: string;
  landmark: string;
   loc?: {
    type: "Point"; // Should always be "Point" for geospatial data
    coordinates: [number, number]; // [longitude, latitude]
  };
  description: string;
  qrCode: string;
  members: ObjectId[]; // Array of User IDs (ObjectId)
  allowMusicians: boolean;
  notifyFavMusicians: boolean;
  isCancelled: boolean;
  isDeleted: boolean;
}

