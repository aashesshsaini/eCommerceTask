"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./config/config"));
const bootstrap_1 = __importDefault(require("./utils/bootstrap"));
const app_1 = __importDefault(require("./app"));
const mongooseOptions = {
// useNewUrlParser: true,
// useUnifiedTopology: true,
// Add other options if needed
};
mongoose_1.default.connect(config_1.default.mongoose.url, mongooseOptions).then(() => {
    console.log("Connected to MongoDB");
    (0, bootstrap_1.default)();
    const server = app_1.default.listen(config_1.default.port, () => {
        console.log(`Listening to port ${config_1.default.port}`);
    });
});
