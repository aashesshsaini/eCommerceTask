"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18n_1 = require("i18n");
const path_1 = __importDefault(require("path"));
const i18n = new i18n_1.I18n({
    locales: ['en', 'hi'],
    defaultLocale: 'en',
    cookie: 'locale',
    directory: path_1.default.join(__dirname, 'locales'),
    directoryPermissions: '755',
    autoReload: true,
    updateFiles: true,
    objectNotation: true,
    api: {
        _: '_',
        __n: '__n',
    },
});
exports.default = i18n;
