import Joi from 'joi';
import { JOI } from '../../config/appConstant';

const createProduct = {
    body: Joi.object().keys({
        productName: Joi.string().required(),
        productImages: Joi.array().items(Joi.string().required()),
        stock: Joi.number().required(),
        price: Joi.number().required()
    })
}

const getProduct = {
    query: Joi.object().keys({
        page: JOI.PAGE,
        limit: JOI.LIMIT,
        search: Joi.string().allow('')
    })
}

const updateProduct = {
    body: Joi.object().keys({
        productId:JOI.OBJECTID,
        productName: Joi.string(),
        productImages: Joi.array().items(Joi.string()),
        stock: Joi.number(),
        price: Joi.number()
    })
}


const deleteProduct = {
    query: Joi.object().keys({
        productId: JOI.OBJECTID
    })
}

const orderListing = {
    query: Joi.object().keys({
        page: JOI.PAGE,
        limit: JOI.LIMIT,
        search: Joi.string().allow('')
    })
}


export default { createProduct, getProduct, updateProduct, deleteProduct, orderListing }