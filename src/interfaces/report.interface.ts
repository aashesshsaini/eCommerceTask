import { Types, Document, Schema } from "mongoose";

export interface ReportDocument extends Document {
  reportedBy: Schema.Types.ObjectId,
  reportedTo: Schema.Types.ObjectId,
  reportType: string;
  status: Boolean;
  isDeleted: Boolean;
}
