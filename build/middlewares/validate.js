"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateView = exports.validate = void 0;
const joi_1 = __importDefault(require("joi"));
const universalFunctions_1 = require("../utils/universalFunctions");
const error_1 = require("../utils/error");
const validate = (schema) => (req, res, next) => {
    const validSchema = (0, universalFunctions_1.pick)(schema, ['params', 'query', 'body', 'files']);
    const object = (0, universalFunctions_1.pick)(req, Object.keys(validSchema));
    const { value, error } = joi_1.default.compile(validSchema)
        .prefs({ errors: { label: 'key' } })
        .validate(object, { abortEarly: false });
    if (error) {
        let errorMessage = error.details
            .map((details) => details.message)
            .join(', ')
            .replace(/"/g, '');
        return next(new error_1.ValidationError(errorMessage));
    }
    Object.assign(req, value);
    return next();
};
exports.validate = validate;
const validateView = (schema) => (req, res, next) => {
    const validSchema = (0, universalFunctions_1.pick)(schema, ['params', 'query', 'body', 'files']);
    const object = (0, universalFunctions_1.pick)(req, Object.keys(validSchema));
    const { value, error } = joi_1.default.compile(validSchema)
        .prefs({ errors: { label: 'key' } })
        .validate(object);
    if (error) {
        const errorMessage = error.details
            .map((details) => details.message)
            .join(', ');
        return res.render('commonMessage', {
            title: 'Something went wrong',
            errorMessage,
            // projectName: config.projectName,
        });
    }
    Object.assign(req, value);
    return next();
};
exports.validateView = validateView;
