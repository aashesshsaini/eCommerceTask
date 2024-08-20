import { Document } from "mongoose";

export interface AdminDocument extends Document {
    name:string,
    email:string,
    password:string
}

