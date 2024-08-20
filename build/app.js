"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet = __importStar(require("helmet"));
const passport_1 = __importDefault(require("passport"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const common_1 = require("./middlewares/common");
const passport_2 = __importDefault(require("./config/passport"));
const i18n_1 = __importDefault(require("./middlewares/i18n"));
const routes_1 = __importDefault(require("./routes"));
const common_2 = require("./middlewares/common");
const app = (0, express_1.default)();
const file = path_1.default.join(__dirname + "/../");
app.use(express_1.default.json());
app.use(body_parser_1.default.json({ limit: '50mb' }));
app.use(express_1.default.static(file));
app.use((req, res, next) => {
    i18n_1.default.init(req, res, next);
});
app.use((0, morgan_1.default)("dev"));
app.use((0, cors_1.default)());
app.use(helmet.default());
app.options("*", (0, cors_1.default)());
app.set("view engine", "hbs");
app.use(body_parser_1.default.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000
}));
app.use(passport_1.default.initialize());
(0, passport_2.default)(passport_1.default);
app.use("/user/auth", common_1.authLimiter);
app.use("/", routes_1.default);
app.use((req, res, next) => {
    (0, common_2.routeNotFoundHandler)(req, res, next);
});
app.use(common_2.errorHandler);
exports.default = app;
