import bcrypt from "bcryptjs";
import { Admin, Jam, Token, User } from "../../models";
import { STATUS_CODES, ERROR_MESSAGES } from "../../config/appConstant";
import { OperationalError } from "../../utils/error";
import { Dictionary } from "../../types";
import { ObjectId } from "mongoose";
import { AdminDocument } from "../../interfaces/admin.interface";
import { paginationOptions } from "../../utils/universalFunctions";

const addUser = async (body: { email: string; password: string }) => {
  const { email, password } = body;
  const userData = await User.findOne({
    email: email,
    isVerified: true,
    isDeleted: false,
  });
  if (userData) {
    throw new OperationalError(
      STATUS_CODES.ACTION_FAILED,
      ERROR_MESSAGES.EMAIL_ALREADY_EXIST
    );
  }
  const newHashedPassword = await bcrypt.hash(password, 8);
  const user = await User.create({
    email,
    password: newHashedPassword,
  });
  return user;
};

const deleteUser = async (query: Dictionary) => {
  const { userId } = query;
  const [deletedProfile, deletedToken] = await Promise.all([
    User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { lean: true, new: true }
    ),
    Token.updateMany({ user: userId }, { isDeleted: true }),
  ]);
  if (!deletedProfile) {
    throw new OperationalError(
      STATUS_CODES.NOT_FOUND,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }
};

const userBlock = async (body: { userId: ObjectId }) => {
  const { userId } = body;
  const user = await User.findOne({
    _id: userId,
    isDeleted: false,
    isBlocked: false,
  });
  if (user) {
    var updateUser = await User.findByIdAndUpdate(
      { _id: userId, isBlocked: false },
      { isBlocked: true },
      { lean: true, new: true }
    );
    return { updateUser: "user Inactive successfully" };
  } else {
    updateUser = await User.findByIdAndUpdate(
      { _id: userId, isBlocked: true },
      { isBlocked: false },
      { lean: true, new: true }
    );
    return { updateUser: "user Active successfully" };
  }
};

const userInfo = async (query: Dictionary) => {
  const { userId } = query;
  console.log(userId, "userId..............");
  const user = await User.findOne(
    {
      _id: userId,
      isDeleted: false,
      isVerified: true,
    },
    { password: 0 }
  );
  console.log(user);
  if (!user) {
    throw new OperationalError(
      STATUS_CODES.NOT_FOUND,
      ERROR_MESSAGES.USER_NOT_FOUND
    );
  }
  return user;
};

const getUsers = async (query: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const { page = 1, limit = 10, search } = query;
  var filter: {
    isDeleted: boolean;
    isVerified: boolean;
    $or?: Array<
      | { fName?: { $regex: RegExp } }
      | { lName?: { $regex: RegExp } }
      | { email?: { $regex: RegExp } }
    >;
  } = {
    isDeleted: false,
    isVerified: true,
  };

  if (search) {
    filter = {
      ...filter,
      $or: [
        { fName: { $regex: RegExp(search, "i") } },
        { lName: { $regex: RegExp(search, "i") } },
        { email: { $regex: RegExp(search, "i") } },
      ],
    };
  }
  const [Users, countUser] = await Promise.all([
    User.find(filter, {}, paginationOptions(page, limit)),
    User.countDocuments(filter),
  ]);
  return { Users, countUser };
};

const dashboard = async () => {
  const userQuery: { isDeleted: boolean; isVerified: boolean } = {
    isDeleted: false,
    isVerified: true,
  };
  var filter = { isDeleted: false };

  const [countUser, countCreatedJams, countPerformedJams] = await Promise.all([
    User.countDocuments(userQuery),
    Jam.countDocuments(filter),
    Jam.countDocuments(),
  ]);
  return { countUser, countCreatedJams, countPerformedJams };
};

export { addUser, deleteUser, userBlock, userInfo, getUsers, dashboard };
