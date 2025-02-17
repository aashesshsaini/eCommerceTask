"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatSignUpUser = exports.formatUser = void 0;
const formatUser = (user) => {
    console.log(user, "user in format object");
    // const userCopy = { ...user._doc } ? { ...user._doc } : user
    const userCopy = Object.keys(user._doc || {}).length ? Object.assign({}, user._doc) : user;
    console.log(userCopy, "userCopy");
    delete userCopy.__v;
    delete userCopy.password;
    console.log(userCopy, "userCopy.........");
    return userCopy;
};
exports.formatUser = formatUser;
const formatSignUpUser = (user) => {
    const userCopy = user.toObject();
    delete userCopy.__v;
    delete userCopy.password;
    return userCopy;
};
exports.formatSignUpUser = formatSignUpUser;
