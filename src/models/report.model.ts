import mongoose, { Types, Document, Schema } from "mongoose";
import { STATUS, USER_TYPE, MESSAGE_TYPE } from "../config/appConstant";
import { ReportDocument } from "../interfaces/report.interface";

const reportSchema = new Schema<ReportDocument>(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    reportedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    reportType: {
      type: String,
    },
    status: {
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

const Report = mongoose.model<ReportDocument>("reports", reportSchema);

export default Report;
