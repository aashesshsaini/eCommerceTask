import winston, { format, transports } from 'winston';
import config from './config';
import {env} from "process"

const enumerateErrorFormat = format((info) => {
    if (info instanceof Error) {
        Object.assign(info, { message: info.stack });
    }
    return info;
});

const logger = winston.createLogger({
    level: config.env === 'development' ? 'debug' : 'info',
    format: format.combine(
        enumerateErrorFormat(),
        config.env === 'development'
            ? format.colorize()
            : format.uncolorize(),
        format.splat(),
        format.printf(({ level, message }) => `${level}: ${message}`)
    ),
    transports: [
        new transports.Console({
            stderrLevels: ['error'],
        }),
    ],
});

export default logger;
