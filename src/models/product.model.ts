import mongoose, { Schema } from "mongoose";
import { ProductDocument } from "../interfaces/product.interface";

const productSchema = new Schema<ProductDocument>(
    {
        productName: {
            type: String,
            trim: true,
            required: true
        },
        productImages: [{
            type: String,
            trim: true,
            required: true
        }],
        stock: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        cartUsers: [{
            type: Schema.Types.ObjectId,
            ref: 'users',
        }],
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

const Product = mongoose.model<ProductDocument>("products", productSchema);

export default Product;
