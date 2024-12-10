import { Jam, Token, User } from "../../models";
import { STATUS_CODES, ERROR_MESSAGES } from "../../config/appConstant";
import { OperationalError } from "../../utils/error";
import config from "../../config/config";
import { Dictionary } from "../../types";
import { JamDocument, UserDocument } from "../../interfaces";
import { ObjectId } from "mongoose";
import { objectId } from "../../validations/custom.validation";
import { paginationOptions } from "../../utils/universalFunctions";
import moment from "moment-timezone";
import QRCode from "qrcode";
import { exist } from "joi";
// import sendPushNotification from '../../utils/notification';

const getDateInTimeZone = (date: Date, timeZone: string) => {
  return moment.tz(date, timeZone);
};

const jamCreate = async (body: Dictionary, user: ObjectId) => {
  const {
    jamName,
    availableDates,
    genre,
    repertoire,
    commitmentLevel,
    image,
    bandFormation,
    // city,
    // region,
    landmark,
    longitude,
    latitude,
    description,
    allowMusicians,
    notifyFavMusicians,
    level,
    tryMyLuck,
    document,
  } = body;

  const address = `${landmark}`;
  const qrCode = await QRCode.toDataURL(address);

  const jamData = Jam.create({
    user,
    jamName,
    availableDates,
    genre,
    repertoire,
    commitmentLevel,
    image,
    bandFormation,
    // city,
    // region,
    landmark,
    loc: { type: "Point", coordinates: [longitude, latitude] },
    description,
    qrCode,
    allowMusicians,
    notifyFavMusicians,
    level,
    tryMyLuck,
    document,
  });
  if (!jamData) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.JAM_NOT_FOUND
    );
  }

  return jamData;
};

const jamGet = async (query: Dictionary, user: ObjectId, timeZone?: string) => {
  const {
    page,
    limit,
    genre,
    date,
    startDate,
    endDate,
    search,
    latitude,
    longitude,
    commitmentLevel,
    instrument,
    distance,
  } = query;

  const currentUser = await User.findById(user);
  const favMembers = currentUser?.favMembers || [];

  var filter: Dictionary = {
    isDeleted: false,
    isCancelled: false,
    $or: [{ user: user }, { members: { $in: [user] } }],
  };

  var nearByJamsFilter: Dictionary = {
    isDeleted: false,
    isCancelled: false,
    allowMusicians: true,
    user: { $ne: user },
  };

  var hostedJamsFilter: Dictionary = {
    user,
    isDeleted: false,
  };

  var attendedJamsFilter = {
    members: { $in: [user] },
    isDeleted: false,
  };

  if (genre) {
    (filter = {
      ...filter,
      genre,
    }),
      (nearByJamsFilter = {
        ...nearByJamsFilter,
        genre,
      });
  }

  if (date) {
    const dateInTimeZone = timeZone
      ? getDateInTimeZone(date, timeZone)
      : moment(date);
    const startOfDay = dateInTimeZone.startOf("day").toDate();
    const endOfDay = dateInTimeZone.endOf("day").toDate();

    filter = {
      ...filter,
      "availableDates.date": { $gte: startOfDay, $lte: endOfDay },
    };
    nearByJamsFilter = {
      ...nearByJamsFilter,
      "availableDates.date": { $gte: startOfDay, $lte: endOfDay },
    };
  } else {
    const today = timeZone
      ? getDateInTimeZone(new Date(), timeZone)
      : moment().startOf("day");
    const startOfToday = today.startOf("day").toDate();

    filter = {
      ...filter,
      $expr: {
        $and: [
          { $ne: ["$availableDates", []] }, 
          { $gte: [{ $min: "$availableDates.date" }, startOfToday] },
        ],
      },
    };

    nearByJamsFilter = {
      ...nearByJamsFilter,
      $expr: {
        $and: [
          { $ne: ["$availableDates", []] }, 
          { $gte: [{ $min: "$availableDates.date" }, startOfToday] }, 
        ],
      },
    };

    // filter = {
    //   ...filter,
    //   availableDates: { $ne: [] },
    //   "availableDates.date": { $gte: startOfToday },
    // };
    // nearByJamsFilter = {
    //   ...nearByJamsFilter,
    //   availableDates: { $ne: [] },
    //   "availableDates.date": { $gte: startOfToday },
    // };
  }

  if (startDate && endDate) {
    const start = timeZone
      ? getDateInTimeZone(startDate, timeZone)
      : moment(startDate).startOf("day");
    const end = timeZone
      ? getDateInTimeZone(endDate, timeZone)
      : moment(endDate).endOf("day");

    console.log(start, end); // Check the start and end dates after processing

    filter = {
      ...filter,
      "availableDates.date": {
        ...(start ? { $gte: start.startOf("day").toDate() } : {}),
        ...(end ? { $lte: end.endOf("day").toDate() } : {}),
      },
    };

    nearByJamsFilter = {
      ...nearByJamsFilter,
      "availableDates.date": {
        ...(start ? { $gte: start.startOf("day").toDate() } : {}),
        ...(end ? { $lte: end.endOf("day").toDate() } : {}),
      },
    };
  }

  if (latitude && longitude) {
    console.log(latitude, "latitude.........", longitude, "longitude.........");
    nearByJamsFilter = {
      ...nearByJamsFilter,
      loc: {
        $near: {
          $geometry: { type: "Point", coordinates: [longitude, latitude] },
          $maxDistance: distance ? distance * 1000 : 10000,
          // $minDistance: 0,
        },
      },
    };
  }

  console.log(nearByJamsFilter, "nearByJamsFilter.............");

  if (commitmentLevel) {
    (filter = {
      ...filter,
      commitmentLevel,
    }),
      (nearByJamsFilter = {
        ...nearByJamsFilter,
        commitmentLevel,
      });
  }

  if (instrument) {
    filter = {
      ...filter,
      bandFormation: {
        $elemMatch: { instrument: instrument },
      },
    };

    nearByJamsFilter = {
      ...nearByJamsFilter,
      bandFormation: {
        $elemMatch: { instrument: instrument },
      },
    };
  }

  if (search) {
    const trimmedSearch = search.trim();
    const matchingUsers = await User.find({
      firstName: { $regex: RegExp(trimmedSearch, "i") },
      lastName: { $regex: RegExp(trimmedSearch, "i") },
    });
    const matchingUserIds = matchingUsers.map((user) => user._id);
    filter = {
      ...filter,
      $or: [
        { jamName: { $regex: RegExp(trimmedSearch, "i") } },
        { genre: { $regex: RegExp(trimmedSearch, "i") } },
        { commitmentLevel: { $regex: RegExp(trimmedSearch, "i") } },
        { "bandFormation.instrument": { $regex: RegExp(trimmedSearch, "i") } },
        { members: { $in: matchingUserIds } },
      ],
    };
  }

  console.log(filter, "filter,,,,,,,,,,,,,");
  const [
    jams,
    jamsCount,
    nearByJams,
    hostedJams,
    hostedJamsCount,
    attendedJams,
    attendedJamsCount,
  ] = await Promise.all([
    Jam.find(filter, {}, paginationOptions(page, limit))
      .populate("user")
      .populate("members"),
    Jam.countDocuments(filter),
    Jam.find(nearByJamsFilter, {}, paginationOptions(page, limit)).populate(
      "user"
    ),
    Jam.find(hostedJamsFilter, {}, paginationOptions(page, limit)).populate(
      "user"
    ),
    Jam.countDocuments(hostedJamsFilter),
    Jam.find(attendedJamsFilter, {}, paginationOptions(page, limit)).populate(
      "user"
    ),
    Jam.countDocuments(attendedJamsFilter),
  ]);

  console.log(nearByJams, "nearByJams...........");

  const addIsFav = (jamList: any[]) => {
    return jamList.map((jam) => ({
      ...jam,
      user: {
        ...jam.user,
        isFav: favMembers.includes(jam.user._id) ? true : false,
      },
    }));
  };

  const jamsWithFav = addIsFav(jams);
  const nearByJamsWithFav = addIsFav(nearByJams);

  const nearByJamsCount = nearByJams.length;

  return {
    jams: jamsWithFav,
    jamsCount,
    nearByJams: nearByJamsWithFav,
    nearByJamsCount,
    hostedJams,
    hostedJamsCount,
    attendedJams,
    attendedJamsCount,
  };
};

const jamUpdate = async (body: Dictionary, user: ObjectId) => {
  const {
    jamId,
    jamName,
    availableDates,
    genre,
    repertoire,
    bandFormation,
    // city,
    // region,
    landmark,
    commitmentLevel,
    image,
    description,
    allowMusicians,
    notifyFavMusicians,
    level,
    document,
  } = body;
  const jamUpdatedData = await Jam.findOneAndUpdate(
    { _id: jamId, user, isDeleted: false },
    {
      jamName,
      availableDates,
      genre,
      repertoire,
      bandFormation,
      // city,
      // region,
      landmark,
      commitmentLevel,
      image,
      description,
      allowMusicians,
      notifyFavMusicians,
      level,
      document,
    },
    { lean: true, new: true }
  );
  if (!jamUpdatedData) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.JAM_NOT_FOUND
    );
  }
  return jamUpdatedData;
};

const jamDelete = async (query: Dictionary, user: ObjectId) => {
  const { jamId } = query;
  const deletedJam = await Jam.findOneAndUpdate(
    { _id: jamId, user, isDeleted: false },
    { $set: { isDeleted: true } },
    { lean: true, new: true }
  );
  if (!deletedJam) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.JAM_NOT_FOUND
    );
  }
};

const jamInfo = async (query: Dictionary, userId: ObjectId) => {
  const { jamId } = query;
  const [jamData, userData] = await Promise.all([
    Jam.findOne({ _id: jamId, isDeleted: false }).populate(
      "user"
    ) as Dictionary,
    User.findById(userId),
  ]);
  if (!jamData) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.JAM_NOT_FOUND
    );
  }
  const isFav = userData?.favMembers?.includes(jamData.user?._id);
  console.log(isFav, "isFav..............");

  return {
    ...jamData._doc, // Spread the jamData's document fields
    user: {
      ...jamData?.user?._doc, // Spread the jamData's user document fields
      isFav: isFav, // Add the isFav field
    },
  };
};

const cancelJam = async (body: Dictionary, userId: ObjectId) => {
  const { jamId } = body;
  const cancelledJamData = await Jam.findOneAndUpdate(
    { _id: jamId, user: userId, isDeleted: false, isCancelled: false },
    { isCancelled: true },
    { lean: true, new: true }
  );
  if (!cancelledJamData) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.JAM_NOT_FOUND
    );
  }
  return cancelledJamData;
};

const getUsers = async (query: Dictionary, userId: ObjectId) => {
  const {
    page,
    limit,
    search,
    latitude,
    longitude,
    instrument,
    commitmentLevel,
    genre,
    jamId,
    isFavMemberOnly,
  } = query;
  let userQuery: Dictionary = {
    isDeleted: false,
    isVerified: true,
    _id: { $ne: userId },
  };
  //  if(commitmentLevel){
  //      userQuery = {
  //     ...userQuery,
  //     commitmentLevel
  //   }
  //  }

  if (instrument) {
    userQuery = {
      ...userQuery,
      instrument,
    };
  }

  if (genre) {
    userQuery = {
      ...userQuery,
      genre,
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
  // console.log(userQuery, "suerQuery...........");
  let jamInvitedMembers: string[] = [];
  if (jamId) {
    const jam = await Jam.findById(jamId).select("invitedMembers").lean();
    if (jam) {
      console.log(jam, "jam.............");
      jamInvitedMembers = jam.invitedMembers.map((member) => member.toString());
    }
  }

  if (isFavMemberOnly) {
    userQuery = {
      ...userQuery,
    };
  }
  const [Users, countUser, userData] = await Promise.all([
    User.find(userQuery, { password: 0 }, paginationOptions(page, limit)),
    User.countDocuments(userQuery),
    User.findById(userId).select("favMembers"),
  ]);
  //  if(!Users || countUser===0){
  //   throw new OperationalError(
  //     STATUS_CODES.ACTION_FAILED,
  //     ERROR_MESSAGES.USER_NOT_FOUND
  //   )
  //  }
  console.log(userData, "userData...........`");
  const updatedUsers = await Promise.all(
    Users.map(async (user: Dictionary) => {
      const isFav = userData?.favMembers?.includes(user._id);

      const hostedJamsFilter = { user: user._id, isDeleted: false };
      const [hostedJams, hostedJamsCount] = await Promise.all([
        Jam.find(hostedJamsFilter),
        Jam.countDocuments(hostedJamsFilter),
      ]);

      const attendedJamsFilter = {
        members: { $in: [user._id] },
        isDeleted: false,
      };
      const [attendedJams, attendedJamsCount] = await Promise.all([
        Jam.find(attendedJamsFilter),
        Jam.countDocuments(attendedJamsFilter),
      ]);

      console.log(user._id, "user._id", "/n", typeof user._id);

      const isInvited = jamId
        ? jamInvitedMembers.includes(user._id.toString())
        : undefined;

      console.log(isInvited, "isInvited.........");

      return {
        ...user,
        isFav,
        hostedJams,
        hostedJamsCount,
        attendedJams,
        attendedJamsCount,
        ...(jamId && { isInvited }),
      };
    })
  );

  // console.log(updatedUsers);
  return { Users: updatedUsers, countUser };
};

const favMember = async (body: Dictionary, userId: ObjectId) => {
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
};

// const favMemberGet = async (query: Dictionary, userId: ObjectId) => {
//   const { page, limit, search, jamId } = query;
//   const matchCondition: Dictionary = {};
//   if (search) {
//     const trimmedSearch = search.trim();
//     matchCondition.$or = [
//       { firstName: { $regex: trimmedSearch, $options: "i" } },
//       { lastName: { $regex: trimmedSearch, $options: "i" } },
//     ];
//   }
//   let jamInvitedMembers: string[] = [];
//   if (jamId) {
//     const jam = await Jam.findById(jamId).select("invitedMembers").lean();
//     if (jam) {
//       console.log(jam, "jam.............");
//       jamInvitedMembers = jam.invitedMembers.map((member) => member.toString());
//     }
//   }
//   const favMemList = await User.findById(userId, { favMembers: 1, _id: 0 })
//     .populate({
//       path: "favMembers",
//       match: matchCondition,
//       options: {
//         limit: limit,
//         skip: page * limit,
//       },
//     })
//     .lean();

//   // const favMemCount = await User.findById(userId).countDocuments({ favMembers: { $exists: true, $not: { $size: 0 } } });
//   const favMemCount = favMemList?.favMembers?.length;
//   const favMembers = favMemList?.favMembers || [];

//  const favMemListWithIsInvited = favMembers.map((favMember) => ({
//    ...favMember,
//    isInvited: jamId
//      ? jamInvitedMembers.includes(favMember._id.toString())
//      : undefined,
//  }));

//   return { favMemList: favMemListWithIsInvited, favMemCount };
// };

const favMemberGet = async (query: Dictionary, userId: ObjectId) => {
  const { page, limit, search, jamId } = query;

  // Build search condition
  const matchCondition: Dictionary = {};
  if (search) {
    const trimmedSearch = search.trim();
    matchCondition.$or = [
      { firstName: { $regex: trimmedSearch, $options: "i" } },
      { lastName: { $regex: trimmedSearch, $options: "i" } },
    ];
  }

  // Get invited members of the Jam
  let jamInvitedMembers: string[] = [];
  if (jamId) {
    const jam = await Jam.findById(jamId).select("invitedMembers").lean();
    if (jam) {
      jamInvitedMembers = jam.invitedMembers.map((member: ObjectId) =>
        member.toString()
      );
    }
  }
  interface FavMember {
    _id: ObjectId;
    firstName: string;
    lastName: string;
    [key: string]: any; // For additional properties
  }

  // Fetch favorite members
  const userWithFavMembers = await User.findById(userId, {
    favMembers: 1,
    _id: 0,
  })
    .populate({
      path: "favMembers",
      match: matchCondition,
      options: {
        limit: limit,
        skip: page * limit,
      },
    })
    .lean<{ favMembers: FavMember[] }>();

  const favMembers = userWithFavMembers?.favMembers || [];
  const favMemCount = favMembers.length;

  const favMemListWithIsInvited = favMembers.map((favMember) => ({
    ...favMember,
    isInvited: jamId
      ? jamInvitedMembers.includes(favMember._id.toString())
      : undefined,
  }));

  return { favMemList: favMemListWithIsInvited, favMemCount };
};

const inviteMembers = async (body: Dictionary, userId: ObjectId) => {
  const { memberId, jamId } = body;
  const validmemberId = Array.isArray(memberId) ? memberId : [];
  console.log(memberId, "....................");
  const [deviceTokens, jamData] = await Promise.all([
    Token.find({
      user: { $in: memberId },
      isDeleted: false,
    }).distinct("device.token"),
    Jam.findOneAndUpdate(
      { _id: jamId, isDeleted: false },
      { $addToSet: { invitedMembers: { $each: validmemberId } } },
      { new: true }
    ),
  ]);
  console.log(jamData, "jamData............");
  //  sendPushNotification("invitation from the jam", "message", deviceTokens)
};

const acceptJam = async (body: Dictionary, userId: ObjectId) => {
  const { jamId, case: action } = body;
  switch (action) {
    case "accept":
      await Jam.findOneAndUpdate(
        { _id: jamId, isDeleted: false },
        { $addToSet: { members: userId } },
        { lean: true, new: true }
      );
      return { message: "User added to the jam successfully." };
    case "reject":
      return { message: "User added to the jam successfully." };
    default:
      return { message: "Invalid case action." };
  }
};

export {
  jamCreate,
  jamGet,
  jamUpdate,
  jamDelete,
  jamInfo,
  cancelJam,
  getUsers,
  favMember,
  favMemberGet,
  inviteMembers,
  acceptJam,
};
