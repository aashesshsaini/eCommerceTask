import mongoose, { Schema } from "mongoose";
import { OrderDocument } from "../interfaces/order.interface";
import { ORDER_STATUS } from "../config/appConstant";

const orderSchema = new Schema<OrderDocument>(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: 'products',
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        amount: {
            type: Number
        },
        isPayment: {
            type: Boolean,
            default: false
        },
        status: {
            type: String,
            enum: [...Object.values(ORDER_STATUS)],
            default: ORDER_STATUS.PENDING
        },
        paymentIntentId: {
            type: String
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

const Order = mongoose.model<OrderDocument>("orders", orderSchema);

export default Order;
