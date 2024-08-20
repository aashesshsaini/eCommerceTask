"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationOptions = exports.pick = exports.catchAsync = void 0;
const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
        console.log(err);
        next(err);
    });
};
exports.catchAsync = catchAsync;
const paginationOptions = (page, limit) => {
    return { sort: { _id: -1 }, skip: page * limit, limit, lean: true };
};
exports.paginationOptions = paginationOptions;
const pick = (object, keys) => {
    return keys.reduce((obj, key) => {
        if (object && Object.prototype.hasOwnProperty.call(object, key)) {
            obj[key] = object[key];
        }
        return obj;
    }, {});
};
exports.pick = pick;
