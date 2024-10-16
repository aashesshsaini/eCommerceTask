import { Jam, Token, User } from '../../models';
import { STATUS_CODES, ERROR_MESSAGES } from '../../config/appConstant';
import { OperationalError } from '../../utils/error';
import config from "../../config/config"
import { Dictionary } from '../../types';
import { JamDocument, UserDocument } from '../../interfaces';
import { ObjectId } from 'mongoose';
import { objectId } from '../../validations/custom.validation';
import { paginationOptions } from '../../utils/universalFunctions';
import moment from "moment-timezone";
import QRCode from "qrcode";
// import sendPushNotification from '../../utils/notification';

const getDateInTimeZone = (date:Date, timeZone:string) => {
  return moment.tz(date, timeZone);
};

const jamCreate = async(body:Dictionary, user:ObjectId)=>{
  const {jamName, availableDates, genre, repertoire, commitmentLevel, image, bandFormation, city, region, landmark, longitude, latitude, description, allowMusicians, notifyFavMusicians} = body

const address = `${city}, ${region}, ${landmark}`;
const qrCode = await QRCode.toDataURL(address);

  const jamData = Jam.create({user, jamName, availableDates, genre, repertoire, commitmentLevel, image, bandFormation, city, region, landmark,  loc: { type: "Point", coordinates: [longitude, latitude] }, description, qrCode, allowMusicians, notifyFavMusicians})
  if(!jamData){
    throw new OperationalError(
        STATUS_CODES.ACTION_FAILED,
        ERROR_MESSAGES.JAM_NOT_FOUND
    )
  }

  return jamData
}

  const jamGet = async(query:Dictionary, user:ObjectId, timeZone ? :string)=>{
  const {page, limit, genre, date, search, latitude, longitude, commitmentLevel, instrument} = query

 var filter: Dictionary = {
  isDeleted: false,
  isCancelled:false,
  $or: [
    { user: user },                 
    { members: { $in: [user] } } 
  ]
};

var nearByJamsFilter: Dictionary = {
  isDeleted:false,
  isCancelled:false,
  allowMusicians:true
}

var hostedJamsFilter: Dictionary = {
  user,
  isDeleted:false,
}

var attendedJamsFilter = {
  members: { $in: [user] },  
  isDeleted: false           
};

  if(genre){
    filter = {
      ...filter,
      genre
    },
    nearByJamsFilter = {
      ...nearByJamsFilter,
      genre
    }
  }

if (date) {
  const dateInTimeZone = timeZone ? getDateInTimeZone(date, timeZone) : moment(date);
  const startOfDay = dateInTimeZone.startOf('day').toDate();
  const endOfDay = dateInTimeZone.endOf('day').toDate();

  filter = {
    ...filter,
      'availableDates.date': { $gte: startOfDay, $lte: endOfDay } 
  };
  nearByJamsFilter = {
    ...nearByJamsFilter,
    'availableDates.date': { $gte: startOfDay, $lte: endOfDay }  
  };

} else {
  const today = timeZone ? getDateInTimeZone(new Date(), timeZone) : moment().startOf('day');
  const startOfToday = today.startOf('day').toDate();

  filter = {
    ...filter,
    'availableDates.date': { $gte: startOfToday }  
  };
nearByJamsFilter = {
    ...nearByJamsFilter,
    'availableDates.date': { $gte: startOfToday }  
  };
}

    if (latitude && longitude) {
      nearByJamsFilter = {
        ...nearByJamsFilter,
        loc:{
        $near: {
          $geometry: { type: "Point", coordinates: [longitude, latitude] },
          $maxDistance: 10000, 
          $minDistance: 0  
        },
      }
      };
    }

    if(commitmentLevel){
       filter = {
      ...filter,
      commitmentLevel
    },
    nearByJamsFilter = {
      ...nearByJamsFilter,
      commitmentLevel
    }
    }

    if (instrument) {
  filter = {
    ...filter,
    bandFormation: { 
      $elemMatch: { instrument: instrument }
    }
  };

  nearByJamsFilter = {
    ...nearByJamsFilter,
    bandFormation: { 
      $elemMatch: { instrument: instrument } 
    }
  };
}

    if (search) {
  filter = {
    ...filter,
    $or: [
      { jamName: { $regex: RegExp(search, "i") } },
      { genre: { $regex: RegExp(search, "i") } },
      { commitmentLevel: { $regex: RegExp(search, "i") } },
      { "bandFormation.instrument": { $regex: RegExp(search, "i") } }, // Added specific path
    ],
  };
}

  console.log(filter, "filter,,,,,,,,,,,,,")
  const [jams, jamsCount, nearByJams, hostedJams, hostedJamsCount, attendedJams, attendedJamsCount] = await Promise.all([
    Jam.find(filter,{}, paginationOptions(page, limit)).populate("user"),
    Jam.countDocuments(filter),
    Jam.find(nearByJamsFilter, {},paginationOptions(page, limit)).populate("user"),
    Jam.find(hostedJamsFilter, {}, paginationOptions(page, limit)),
    Jam.countDocuments(hostedJamsFilter),
    Jam.find(attendedJamsFilter, {},paginationOptions(page, limit)),
    Jam.countDocuments(attendedJamsFilter),  
    // Jam.countDocuments(nearByJamsFilter),
  ])
  const nearByJamsCount = nearByJams.length
  return {jams, jamsCount, nearByJams, nearByJamsCount, hostedJams, hostedJamsCount, attendedJams, attendedJamsCount}
  }

const jamUpdate = async(body:Dictionary, user:ObjectId)=>{
 const { jamId, jamName, availableDates, genre, repertoire, bandFormation, city, region, landmark, commitmentLevel, image, description, allowMusicians, notifyFavMusicians} = body
 const jamUpdatedData = await Jam.findOneAndUpdate({_id:jamId, user, isDeleted:false}, {jamName, availableDates, genre, repertoire, bandFormation, city, region, landmark, commitmentLevel, image, description, allowMusicians, notifyFavMusicians},{lean:true, new:true})
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

const jamInfo = async(query:Dictionary, user:ObjectId)=>{
  const {jamId} = query
  const jamData = await Jam.findOne({_id:jamId,isDeleted:false})
  if(!jamData){
     throw new OperationalError(
        STATUS_CODES.ACTION_FAILED,
        ERROR_MESSAGES.JAM_NOT_FOUND
    )
  }
  return jamData
}

const cancelJam = async(body: Dictionary, userId:ObjectId)=>{
  const {jamId} = body
  const cancelledJamData = await Jam.findOneAndUpdate({_id:jamId, user:userId, isDeleted:false, isCancelled:false},{isCancelled:true},{lean:true, new:true})
  if(!cancelledJamData){
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.JAM_NOT_FOUND
    )
  }
  return cancelledJamData
}

const getUsers = async(query:Dictionary, userId:ObjectId)=>{
 const {page, limit, search, latitude, longitude, instrument, commitmentLevel} = query
 let userQuery : Dictionary = {isDeleted:false, isVerified:true}
  //  if(commitmentLevel){
  //      userQuery = {
  //     ...userQuery,
  //     commitmentLevel
  //   }
  //  }

    if (instrument) {
  userQuery = {
    ...userQuery,
      instrument
  };
}

if (search) {
      userQuery = {
        ...userQuery,
        $or: [
          { fullName: { $regex: RegExp(search, "i") } },
          { email: { $regex: RegExp(search, "i") } },
        ],
      };
    }
    console.log(userQuery, "suerQuery...........")
 const [Users, countUser, userData] = await Promise.all([
  User.find(userQuery, {password:0},paginationOptions(page, limit)),
  User.countDocuments(userQuery),
  User.findById(userId).select("favMembers")
 ])
 if(!Users || countUser===0){
  throw new OperationalError(
    STATUS_CODES.ACTION_FAILED,
    ERROR_MESSAGES.NOT_FOUND
  )
 }
 Users.map((user:Dictionary)=>{
  const isFav = userData?.favMembers?.includes(user._id)
  return {...user, isFav}
 })
 return {Users, countUser}
}

const favMember = async(body:Dictionary, userId:ObjectId)=>{
   const { favMemId } = body;
   const user = await User.findOne({
    _id: userId,
    isDeleted: false,
  });

  if (user) {
    const isFavMember = user.favMembers.includes(favMemId);
    let updateUser;
    if (isFavMember) {
      updateUser = await User.findByIdAndUpdate(
        { _id: userId, isBlocked: false },
        { $pull: { favMembers: favMemId } }, 
        { lean: true, new: true }
      );
      return { message: "Removed from favorites" };
    } else {
      updateUser = await User.findByIdAndUpdate(
        { _id: userId, isBlocked: false },
        { $addToSet: { favMembers: favMemId } }, 
        { lean: true, new: true }
      );
      return { message: "Added to favorites" };
    }
  } else {
    return { message: "User not found or already deleted" };
  }

}

const favMemberGet = async(query:Dictionary, userId:ObjectId)=>{
  const {page, limit} = query
  const favMemList = await User.findById(userId, {favMembers:1, _id:0}).populate({
      path: 'favMembers',
      options: {
        limit: limit, 
        skip: page*limit,   
      }
    })
    .lean();

  const favMemCount = await User.findById(userId).countDocuments({ favMembers: { $exists: true, $not: { $size: 0 } } });
  return {favMemList, favMemCount}
}

const inviteMembers = async(body: Dictionary, userId:ObjectId)=>{
   const {members, jamId} = body
   const [deviceTokens, jamData] = await Promise.all([
     Token.find({
       user: { $in: members },
      isDeleted: false,
    }).distinct("device.token"),
    Jam.findOne({_id:jamId, isDeleted:false})
   ]) 
  //  sendPushNotification("invitation from the jam", "message", deviceTokens)
}

const acceptJam = async(body: Dictionary, userId:ObjectId)=>{
  const {jamId, case:action} = body
  switch (action){
    case "accept" :
      await Jam.findOneAndUpdate({_id:jamId, isDeleted:false},{$addToSet:{members:userId}},{lean:true, new:true})
  return { message: "User added to the jam successfully."};
  case "reject" : 
     return { message: "User added to the jam successfully."}
   default:
      return { message: "Invalid case action." };
  }
}

export {jamCreate, jamGet, jamUpdate, jamDelete, jamInfo, cancelJam, getUsers, favMember, favMemberGet, inviteMembers, acceptJam}