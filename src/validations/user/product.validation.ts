import Joi from 'joi';
import { CART_ACTION_CASE, JOI } from '../../config/appConstant';

const getProducts = {
    query: Joi.object().keys({
        page: JOI.PAGE,
        limit: JOI.LIMIT,
        search: Joi.string().allow('')
    })
}

const addRemoveToCart = {
    body: Joi.object().keys({
        productId: JOI.OBJECTID,
        actionCase: Joi.string().required().valid(...Object.values(CART_ACTION_CASE))
    })
}

const createOrder = {
    body: Joi.object().keys({
        productId: JOI.OBJECTID,
        quantity: Joi.number().required()
    })
}

export default { getProducts, createOrder, addRemoveToCart }