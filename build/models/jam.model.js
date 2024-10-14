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
const jamSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId, ref: 'users'
    },
    jamName: {
        type: String
    },
    availableDates: [
        {
            date: {
                type: Date,
            },
            slots: [
                {
                    startTime: { type: String },
                    endTime: { type: String },
                },
            ],
        },
    ],
    genre: {
        type: String
    },
    repertoire: [{
            type: String
        }],
    commitmentLevel: {
        type: String
    },
    image: {
        type: String
    },
    bandFormation: [{
            instrument: {
                type: String
            },
            type: {
                type: String
            }
        }],
    city: {
        type: String
    },
    region: {
        type: String
    },
    landmark: {
        type: String
    },
    loc: {
        type: { type: String, default: "Point" },
        coordinates: {
            type: [Number],
            default: [0, 0],
        },
    },
    description: {
        type: String
    },
    qrCode: {
        type: String
    },
    members: [{
            type: mongoose_1.Schema.Types.ObjectId, ref: 'users'
        }],
    allowMusicians: {
        type: Boolean
    },
    notifyFavMusicians: {
        type: Boolean
    },
    isCancelled: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
const Jam = mongoose_1.default.model("jams", jamSchema);
jamSchema.index({ loc: "2dsphere" });
exports.default = Jam;
