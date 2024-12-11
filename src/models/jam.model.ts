import mongoose, { Types, Document, Schema } from "mongoose";
import { USER_TYPE } from "../config/appConstant";
import { JamDocument } from "../interfaces/jam.interface";
import { string } from "joi";

const jamSchema = new Schema<JamDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    jamName: {
      type: String,
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
      type: String,
    },
    repertoire: [
      {
        type: String,
      },
    ],
    commitmentLevel: {
      type: String,
    },
    image: {
      type: String,
    },
    bandFormation: [
      {
        instrument: {
          type: String,
        },
        type: {
          type: String,
        },
      },
    ],
    landmark: {
      type: String,
    },
    loc: {
      type: { type: String, default: "Point" },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    description: {
      type: String,
    },
    qrCode: {
      type: String,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    invitedMembers: [
      {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    allowMusicians: {
      type: Boolean,
    },
    notifyFavMusicians: {
      type: Boolean,
    },
    level: {
      type: String,
    },
    tryMyLuck: {
      type: Boolean,
      default: false,
    },
    document: [
      {
        type: String,
      },
    ],
    status: {
    type: String
    },
    isCancelled: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Jam = mongoose.model<JamDocument>("jams", jamSchema);

jamSchema.index({ loc: "2dsphere" });

export default Jam;
