"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const appConstant_1 = require("../config/appConstant");
const tokenSchema = new mongoose_1.Schema({
    token: { type: String, unique: true, required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'users' },
    admin: { type: mongoose_1.Schema.Types.ObjectId, ref: 'admins' },
    role: { type: String, enum: [...Object.values(appConstant_1.USER_TYPE)], required: true },
    type: {
        type: String,
        enum: [...Object.values(appConstant_1.TOKEN_TYPE)],
        required: true,
    },
    expires: { type: Date, required: true },
    device: {
        type: {
            type: String,
            enum: [...Object.values(appConstant_1.DEVICE_TYPE)],
        },
        token: { type: String },
    },
    otp: {
        code: String,
        expiresAt: Date
    },
    isDeleted: { type: Boolean, default: false },
    blacklisted: { type: Boolean, default: false },
}, {
    timestamps: true,
});
const Token = mongoose_1.default.model('token', tokenSchema);
exports.default = Token;
