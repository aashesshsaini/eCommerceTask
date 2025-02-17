import { Document, Schema } from "mongoose";

export interface ProductDocument extends Document {
    price: number;
    stock: number;
    productImages: string[];
    productName: string;
    cartUsers: Schema.Types.ObjectId[];
    isDeleted:false
}
