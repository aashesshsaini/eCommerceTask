import { Product } from "../../models";
import { STATUS_CODES, ERROR_MESSAGES } from "../../config/appConstant";
import { OperationalError } from "../../utils/error";
import { Dictionary } from "../../types";
import { paginationOptions } from "../../utils/universalFunctions";

const createProduct = async (body: Dictionary) => {
    try {
        console.log(body, "body.........")
        const productData = await Product.create(body)
        console.log(productData)
        return productData
    } catch (error: any) {
        console.log(error, "error...........")
        throw error
    }
}

const getProduct = async (query: Dictionary) => {
    const { page = 0, limit = 10, search } = query
    try {
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
            Product.find(filter, {}, paginationOptions(page, limit)),
            Product.countDocuments(filter),
        ]);

        return { productListing, productCount };
    } catch (error: any) {
        console.log(error, "error...........")
        throw error
    }
}



const updateProduct = async (body: Dictionary) => {
    try {
        const { productId, productName, productImages, stock, price } = body
        const updatedProductData = await Product.findOneAndUpdate({ _id: productId, isDeleted: false }, { productName, productImages, stock, price }, { lean: true, new: true })
        if (!updatedProductData) {
            throw new OperationalError(
                STATUS_CODES.ACTION_FAILED,
                ERROR_MESSAGES.WRONG_PASSWORD
            )
        }
        return updatedProductData
    } catch (error: any) {
        console.log(error, "error...........")
        throw error
    }
}


const deleteProduct = async (query: Dictionary) => {
    const { productId } = query
    try {
        const deletedProduct = await Product.findByIdAndUpdate(productId, { isDeleted: true }, { new: true, lean: true })
        if (!deletedProduct) {
            throw new OperationalError(
                STATUS_CODES.ACTION_FAILED,
                ERROR_MESSAGES.PRODUCT_NOT_FOUND
            )
        }
        return { deletedProductData: "Product Delete Successfully" }
    } catch (error: any) {
        console.log(error, "error...........")
        throw error
    }
}


export { createProduct, getProduct, updateProduct, deleteProduct }