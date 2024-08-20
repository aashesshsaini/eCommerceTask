"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("./admin/auth.routes"));
const auth_routes_2 = __importDefault(require("./user/auth.routes"));
const userManage_routes_1 = __importDefault(require("./admin/userManage.routes"));
const router = express_1.default.Router();
const defaultRoutes = [
    {
        path: "/admin/auth",
        route: auth_routes_1.default,
    },
    {
        path: "/user/auth",
        route: auth_routes_2.default,
    },
    {
        path: "/admin/userManage",
        route: userManage_routes_1.default,
    },
];
defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});
exports.default = router;
