"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhook = exports.addRemoveToCart = exports.createOrder = exports.getProducts = void 0;
const models_1 = require("../../models");
const appConstant_1 = require("../../config/appConstant");
const error_1 = require("../../utils/error");
const universalFunctions_1 = require("../../utils/universalFunctions");
const redis_1 = __importDefault(require("../../utils/redis"));
const stripe_1 = __importDefault(require("stripe"));
const config_1 = __importDefault(require("../../config/config"));
const sendMails_1 = require("../../libs/sendMails");
const stripeInstance = new stripe_1.default(config_1.default.stripeSecretKey);
const getProducts = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 0, limit = 10, search } = query;
    const cacheKey = `products:page=${page}:limit=${limit}:search=${search || 'all'}`;
    try {
        const cachedData = yield redis_1.default.get(cacheKey);
        if (cachedData) {
            console.log("Fetching from Redis Cache...");
            return JSON.parse(cachedData);
        }
        var filter = {
            isDeleted: false,
        };
        if (search) {
            filter = Object.assign(Object.assign({}, filter), { $or: [
                    { productName: { $regex: RegExp(search, "i") } },
                ] });
        }
        const [productListing, productCount] = yield Promise.all([
            models_1.Product.find(filter, { cartUsers: 0 }, (0, universalFunctions_1.paginationOptions)(page, limit)),
            models_1.Product.countDocuments(filter),
        ]);
        const result = { productListing, productCount };
        const redisData = yield redis_1.default.setEx(cacheKey, 36, JSON.stringify(result));
        return result;
    }
    catch (error) {
        console.log(error, "error...........");
        throw error;
    }
});
exports.getProducts = getProducts;
const addRemoveToCart = (body, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, actionCase } = body;
    try {
        const productData = yield models_1.Product.findOne({ _id: productId, isDeleted: false });
        if (!productData) {
            throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, appConstant_1.ERROR_MESSAGES.PRODUCT_NOT_FOUND);
        }
        console.log(productData, "productData.........");
        switch (actionCase) {
            case appConstant_1.CART_ACTION_CASE.REMOVETOCART:
                yield models_1.Product.findByIdAndUpdate(productId, { $pull: { cartUsers: userId } });
                return { message: "Removed the product from the cart" };
            case appConstant_1.CART_ACTION_CASE.ADDTOCART:
                yield models_1.Product.findByIdAndUpdate(productId, { $addToSet: { cartUsers: userId } });
                return { message: "Added the product to the cart" };
            default:
                throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, "Invalid action case");
        }
    }
    catch (error) {
        console.log(error, "error...........");
        throw error;
    }
});
exports.addRemoveToCart = addRemoveToCart;
const createOrder = (body, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, quantity } = body;
    try {
        const productData = yield models_1.Product.findOne({ _id: productId, isDeleted: false });
        if (!productData) {
            throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, appConstant_1.ERROR_MESSAGES.PRODUCT_NOT_FOUND);
        }
        if (!productData.cartUsers.includes(userId)) {
            throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, "Please add the product in your cart");
        }
        if (productData.stock < quantity) {
            throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, 'Insufficient Stock');
        }
        const amount = productData.price * quantity;
        const orderData = yield models_1.Order.create({ product: productId, user: userId, amount });
        const orderIdForMetaData = orderData._id;
        const metadata = {
            userId: userId.toString() || "",
            amount: (amount * 100).toString(),
            orderId: orderIdForMetaData.toString(),
            quantity: quantity.toString()
        };
        const session = yield stripeInstance.checkout.sessions.create({
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
        return { orderData, session };
    }
    catch (error) {
        console.log(error, "error...........");
        throw error;
    }
});
exports.createOrder = createOrder;
const webhook = (event) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paymentIntent = event.data.object;
        const paymentIntentId = event.data.object.id;
        const { userId, orderId, quantity } = paymentIntent.metadata;
        switch (event.type) {
            case "payment_intent.succeeded":
                const orderData = yield models_1.Order.findById(orderId);
                if (!orderData) {
                    throw new error_1.OperationalError(appConstant_1.STATUS_CODES.ACTION_FAILED, "Order not found");
                }
                const [userData, ProductUpdatedData] = yield Promise.all([
                    models_1.User.findById(userId),
                    models_1.Product.findByIdAndUpdate(orderData.product, { $inc: { stock: -(Number(quantity)) } }),
                    models_1.Order.updateOne({ _id: orderId }, { isPayment: true, paymentIntentId }),
                ]);
                (0, sendMails_1.orderPlacedEmail)(userData === null || userData === void 0 ? void 0 : userData.email, userData === null || userData === void 0 ? void 0 : userData.firstName, ProductUpdatedData === null || ProductUpdatedData === void 0 ? void 0 : ProductUpdatedData.productName, orderData.amount, quantity);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    }
    catch (error) {
        console.log(error, "error...........");
        throw error;
    }
});
exports.webhook = webhook;
