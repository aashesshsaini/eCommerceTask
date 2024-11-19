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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJams = void 0;
const models_1 = require("../../models");
const universalFunctions_1 = require("../../utils/universalFunctions");
const getJams = (query, timeZone) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit } = query;
    var filter = { isDeleted: false };
    const [jams, jamsCount] = yield Promise.all([
        models_1.Jam.find(filter, {}, (0, universalFunctions_1.paginationOptions)(page, limit)),
        models_1.Jam.countDocuments(filter)
    ]);
    console.log(jams, jamsCount, "jams, jamsCount...........");
    return { jams, jamsCount };
});
exports.getJams = getJams;
