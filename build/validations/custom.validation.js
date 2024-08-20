"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.password = exports.objectId = void 0;
const objectId = (value, helpers) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
        return helpers.error('string.customObjectId');
        ;
    }
    return value;
};
exports.objectId = objectId;
const password = (value, helpers) => {
    if (value.length < 8) {
        return helpers.error('string.customObjectId');
    }
    if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        return helpers.error('password must contain at least 1 letter and 1 number');
        ;
    }
    return value;
};
exports.password = password;
