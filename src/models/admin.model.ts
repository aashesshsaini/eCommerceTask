import mongoose, {Types, Document, Schema} from "mongoose";
import { USER_TYPE } from "../config/appConstant";
import bcrypt from "bcryptjs"
import { AdminDocument } from "../interfaces/admin.interface";

const adminSchema = new Schema<AdminDocument>({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    }
}, {timestamps:true})

// adminSchema.pre('save', async function (this: AdminDocument, next) {
//     if (this.isModified('password')) {
//       this.password = await bcrypt.hash(this.password, 8);
//     }
//     next();
//   });

const Admin = mongoose.model<AdminDocument>("admins", adminSchema)

export default Admin