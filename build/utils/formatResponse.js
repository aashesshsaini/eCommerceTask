"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatSignUpUser = exports.formatUser = void 0;
const formatUser = (user) => {
    const userCopy = Object.assign({}, user);
    delete userCopy.__v;
    delete userCopy.password;
    return userCopy;
};
exports.formatUser = formatUser;
const formatSignUpUser = (user) => {
    const userCopy = user.toObject(); // Convert Mongoose document to plain object
    delete userCopy.__v;
    delete userCopy.password;
    return userCopy;
};
exports.formatSignUpUser = formatSignUpUser;
