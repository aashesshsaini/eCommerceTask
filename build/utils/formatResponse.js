"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatUser = void 0;
const formatUser = (user) => {
    const userCopy = Object.assign({}, user);
    delete userCopy.__v;
    delete userCopy.password;
    return userCopy;
};
exports.formatUser = formatUser;
