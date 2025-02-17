import { Document } from "mongoose";

export interface UserDocument extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  mobileNumber: string;
  countryCode: string;
  stripeCustomerId: string;
  isBlocked: boolean;
  isDeleted: boolean;
}
