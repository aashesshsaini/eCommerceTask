import { Jam } from '../../models';
import { STATUS_CODES, ERROR_MESSAGES } from '../../config/appConstant';
import { OperationalError } from '../../utils/error';
import config from "../../config/config"
import { Dictionary } from '../../types';
import { JamDocument } from '../../interfaces';
import { ObjectId } from 'mongoose';
import { objectId } from '../../validations/custom.validation';
import { paginationOptions } from '../../utils/universalFunctions';
import moment from "moment-timezone";
import QRCode from "qrcode";

const getDateInTimeZone = (date:Date, timeZone:string) => {
  return moment.tz(date, timeZone);
};

const jamCreate = async(body:JamDocument, user:ObjectId)=>{
  const {jamName, date, time, genre, repertoire, bandFormation, city, region, landmark, description, allowMusicians, notifyFavMusicians} = body

const address = `${city}, ${region}, ${landmark}`;
const qrCode = await QRCode.toDataURL(address);

  const jamData = Jam.create({user, jamName, date, time, genre, repertoire, bandFormation, city, region, landmark, description, qrCode, allowMusicians, notifyFavMusicians})
  if(!jamData){
    throw new OperationalError(
        STATUS_CODES.ACTION_FAILED,
        ERROR_MESSAGES.JAM_NOT_FOUND
    )
  }

  return jamData
}

const jamGet = async(query:Dictionary, user:ObjectId, timeZone ? :string)=>{
 const {page, limit, genre, date, search, latitude, longitude} = query

 var filter:Dictionary = {isDeleted:false}
 if(genre){
  filter = {
    ...filter,
    genre
  }
 }

  if (date) {
  const dateInTimeZone = timeZone ? getDateInTimeZone(date, timeZone) : moment(date)
  const formatedDate = dateInTimeZone.format("YYYY-MM-DD");
  filter = {
    ...filter,
    date:formatedDate
  }
  }else {
    const today = timeZone ? getDateInTimeZone(new Date(), timeZone) : moment().startOf('day');
    const formattedToday = today.format("YYYY-MM-DD");
    filter = {
      ...filter,
      date: { $gte: formattedToday }, 
    };
  }

   if (latitude && longitude) {
    filter = {
      ...filter,
      $near: {
        $geometry: { type: "Point", coordinates: [longitude, latitude] },
        $maxDistance: 10000, 
        $minDistance: 0  
      },
    };
  }

  if(search){
    filter = {
      ...filter,
       $or: [
          { jamName: { $regex: RegExp(search, "i") } },
        ],
    }
  }

 const [jams, jamsCount] = await Promise.all([
  Jam.find(filter,{}, paginationOptions(page, limit)),
  Jam.countDocuments(filter)
 ])
 return {jams, jamsCount}
}

const jamUpdate = async(body:Dictionary, user:ObjectId)=>{
 const { jamId, jamName, date, time, genre, repertoire, bandFormation, city, region, landmark, description, allowMusicians, notifyFavMusicians} = body
 const jamUpdatedData = await Jam.findOneAndUpdate({_id:jamId, user, isDeleted:false}, {jamName, date, time, genre, repertoire, bandFormation, city, region, landmark, description, allowMusicians, notifyFavMusicians},{lean:true, new:true})
 if(!jamUpdatedData){
   throw new OperationalError(
        STATUS_CODES.ACTION_FAILED,
        ERROR_MESSAGES.JAM_NOT_FOUND
    )
 }
 return jamUpdatedData
}

const jamDelete = async(query:Dictionary, user:ObjectId)=>{
  const {jamId} = query
  const deletedJam = await Jam.findOneAndUpdate({_id:jamId, user, isDeleted:false},{$set:{isDeleted:true}},{lean:true,new:true})
  if(!deletedJam){
     throw new OperationalError(
        STATUS_CODES.ACTION_FAILED,
        ERROR_MESSAGES.JAM_NOT_FOUND
    )
  }
}

export {jamCreate, jamGet, jamUpdate, jamDelete}