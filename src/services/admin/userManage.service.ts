import { Token, User } from "../../models";
import { STATUS_CODES, ERROR_MESSAGES } from "../../config/appConstant";
import { OperationalError } from "../../utils/error";
import { Dictionary } from "../../types";
import { ObjectId } from "mongoose";
import { paginationOptions } from "../../utils/universalFunctions";

const deleteUser = async (query: Dictionary) => {
  const { userId } = query;
  try {
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
  } catch (error: any) {
    console.log(error, "error...........")
    throw error
  }
};

const userBlock = async (body: { userId: ObjectId }) => {
  const { userId } = body;
  try {
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
  } catch (error: any) {
    console.log(error, "error...........")
    throw error
  }
};

const userInfo = async (query: Dictionary) => {
  const { userId } = query;
  console.log(userId, "userId..............");
  try {
    const user = await User.findOne(
      {
        _id: userId,
        isDeleted: false,
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
  } catch (error: any) {
    console.log(error, "error...........")
    throw error
  }
};

const getUsers = async (query: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const { page = 0, limit = 10, search } = query;
  try {
    var filter: {
      isDeleted: boolean;
      $or?: Array<
        | { firstName?: { $regex: RegExp } }
        | { lastName?: { $regex: RegExp } }
        | { email?: { $regex: RegExp } }
      >;
    } = {
      isDeleted: false,
    };

    if (search) {
      filter = {
        ...filter,
        $or: [
          { firstName: { $regex: RegExp(search, "i") } },
          { lastName: { $regex: RegExp(search, "i") } },
          { email: { $regex: RegExp(search, "i") } },
        ],
      };
    }
    const [Users, countUser] = await Promise.all([
      User.find(filter, { password: 0 }, paginationOptions(page, limit)),
      User.countDocuments(filter),
    ]);
    return { Users, countUser };
  } catch (error: any) {
    console.log(error, "error...........")
    throw error
  }
};

const dashboard = async () => {
  try {
    const userQuery: { isDeleted: boolean } = {
      isDeleted: false,
    };
    const [countUser] = await Promise.all([
      User.countDocuments(userQuery),
    ]);
    return { countUser };
  } catch (error: any) {
    console.log(error, "error...........")
    throw error
  }
};

export { deleteUser, userBlock, userInfo, getUsers, dashboard };
