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
const index_1 = require("../models/index");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    let password = 'eCommerceTaskAdmin@123';
    password = yield bcryptjs_1.default.hash(password, 8);
    const adminDetails = {
        name: 'ECommerceTask Admin',
        email: 'admin@ecommercetask.com',
        $setOnInsert: { password },
    };
    createAdmin(adminDetails);
});
const createAdmin = (adminDetails) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminData = yield index_1.Admin.findOneAndUpdate({ email: adminDetails.email }, adminDetails, { lean: true, upsert: true, new: true });
        console.log('=================');
        return adminData;
    }
    catch (err) {
        console.log('**********************************************************************', err);
    }
});
exports.default = run;
