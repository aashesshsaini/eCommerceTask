import { Order, Product, Token, User } from "../../models";
import { STATUS_CODES, ERROR_MESSAGES, CART_ACTION_CASE } from "../../config/appConstant";
import { OperationalError } from "../../utils/error";
import { Dictionary } from "../../types";
import { paginationOptions } from "../../utils/universalFunctions";
import redisClient from '../../utils/redis';
import { ObjectId } from "mongoose";
import Stripe from "stripe"
import config from "../../config/config";
import { orderPlacedEmail } from "../../libs/sendMails";
import { UserDocument } from "../../interfaces";
const stripeInstance = new Stripe(config.stripeSecretKey);

const getProducts = async (query: Dictionary) => {
    const { page = 0, limit = 10, search } = query
    const cacheKey = `products:page=${page}:limit=${limit}:search=${search || 'all'}`;
    try {
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            console.log("Fetching from Redis Cache...");
            return JSON.parse(cachedData);
        }
        var filter: {
            isDeleted: boolean;
            $or?: Array<
                | { productName?: { $regex: RegExp } }
            >;
        } = {
            isDeleted: false,
        };

        if (search) {
            filter = {
                ...filter,
                $or: [
                    { productName: { $regex: RegExp(search, "i") } },
                ],
            };
        }
        const [productListing, productCount] = await Promise.all([
            Product.find(filter, { cartUsers: 0 }, paginationOptions(page, limit)),
            Product.countDocuments(filter),
        ]);

        const result = { productListing, productCount };
        const redisData = await redisClient.setEx(cacheKey, 36, JSON.stringify(result));
        return result;
    } catch (error: any) {
        console.log(error, "error...........")
        throw error
    }
}

const addRemoveToCart = async (body: Dictionary, userId: Dictionary) => {
    const { productId, actionCase } = body
    try {
        const productData = await Product.findOne({ _id: productId, isDeleted: false })
        if (!productData) {
            throw new OperationalError(
                STATUS_CODES.ACTION_FAILED,
                ERROR_MESSAGES.PRODUCT_NOT_FOUND
            )
        }
        console.log(productData, "productData.........")
        switch (actionCase) {
            case CART_ACTION_CASE.REMOVETOCART:
                await Product.findByIdAndUpdate(
                    productId,
                    { $pull: { cartUsers: userId } }
                );
                return { message: "Removed the product from the cart" };

            case CART_ACTION_CASE.ADDTOCART:
                await Product.findByIdAndUpdate(
                    productId,
                    { $addToSet: { cartUsers: userId } }
                );
                return { message: "Added the product to the cart" };

            default:
                throw new OperationalError(
                    STATUS_CODES.ACTION_FAILED,
                    "Invalid action case"
                );
        }
    } catch (error: any) {
        console.log(error, "error...........")
        throw error
    }
}

const createOrder = async (body: Dictionary, userId: ObjectId) => {
    const { productId, quantity } = body
    try {
        const productData = await Product.findOne({ _id: productId, isDeleted: false })
        if (!productData) {
            throw new OperationalError(
                STATUS_CODES.ACTION_FAILED,
                ERROR_MESSAGES.PRODUCT_NOT_FOUND
            )
        }
        if (!productData.cartUsers.includes(userId)) {
            throw new OperationalError(
                STATUS_CODES.ACTION_FAILED,
                "Please add the product in your cart"
            )
        }
        if (productData.stock < quantity) {
            throw new OperationalError(
                STATUS_CODES.ACTION_FAILED,
                'Insufficient Stock'
            )
        }
        const amount = productData.price * quantity
        const orderData = await Order.create({ product: productId, user: userId, amount })
        const orderIdForMetaData = orderData._id as ObjectId;

        const metadata: Dictionary = {
            userId: userId.toString() || "",
            amount: (amount * 100).toString(),
            orderId: orderIdForMetaData.toString(),
            quantity: quantity.toString()
        };

        const session = await stripeInstance.checkout.sessions.create({
            success_url: "https://successUrl.com",
            cancel_url: "https://cancelUrl.com",
            payment_method_types: ["card"],
            customer: userId.toString(),
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: "e-commerce order",
                        },
                        unit_amount: amount * 100, // Convert price to cents
                    },
                    quantity: quantity,
                },
            ],
            payment_intent_data: {
                metadata: metadata,
            },
            metadata: metadata,
            mode: "payment",
        });
        return { orderData, session }
    } catch (error: any) {
        console.log(error, "error...........")
        throw error
    }
}

const webhook = async (event: Dictionary) => {
    try {
        const paymentIntent = event.data.object;
        const paymentIntentId = event.data.object.id;
        const { userId, orderId, quantity } = paymentIntent.metadata

        switch (event.type) {
            case "payment_intent.succeeded":
                const orderData = await Order.findById(orderId);
                if (!orderData) {
                    throw new OperationalError(
                        STATUS_CODES.ACTION_FAILED,
                        "Order not found"
                    );
                }
                const [userData, ProductUpdatedData] = await Promise.all([
                    User.findById(userId) as Dictionary,
                    Product.findByIdAndUpdate(orderData.product, { $inc: { stock: - (Number(quantity)) } }) as Dictionary,
                    Order.updateOne({ _id: orderId }, { isPayment: true, paymentIntentId }) as Dictionary,
                ]);
                orderPlacedEmail(userData?.email, userData?.firstName, ProductUpdatedData?.productName, orderData.amount, quantity)
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    } catch (error: any) {
        console.log(error, "error...........")
        throw error
    }

};

export { getProducts, createOrder, addRemoveToCart, webhook }