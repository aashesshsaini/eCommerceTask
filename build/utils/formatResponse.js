"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatUser = void 0;
const formatUser = (user) => {
    console.log(user, "user........");
    const userCopy = Object.assign({}, user);
    delete userCopy.__v;
    delete userCopy.password;
    console.log(userCopy, "userCopy");
    return userCopy;
};
exports.formatUser = formatUser;
