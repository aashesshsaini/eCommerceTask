import {ERROR_MESSAGES, STATUS_CODES} from "../config/appConstant"

class ValidationError extends Error {
    public logError: boolean;
    public statusCode: number;

    constructor(
        message: string = '',
        logError: boolean = true,
        statusCode: number = STATUS_CODES.VALIDATION_FAILED
    ) {
        super(message);
        Object.setPrototypeOf(this, ValidationError.prototype);
        this.name = this.constructor.name;
        this.message = message;
        this.logError = logError;
        this.statusCode = statusCode;
    }
}

class OperationalError extends Error {
    public data: any;
    public logError: boolean;
    public statusCode: number;

    constructor(
        statusCode: number = STATUS_CODES.ACTION_FAILED,
        message: string = ERROR_MESSAGES.SERVER_ERROR,
        data: any = null,
        logError: boolean = true
    ) {
        super(message);

        Object.setPrototypeOf(this, OperationalError.prototype);
        this.name = '';
        this.data = data;
        this.statusCode = statusCode;
        this.logError = logError;
    }
}

class NotFoundError extends Error {
    public logError: boolean;
    public statusCode: number;

    constructor(
        statusCode: number = STATUS_CODES.NOT_FOUND,
        message: string = ERROR_MESSAGES.NOT_FOUND,
        logError: boolean = true
    ) {
        super(message);
        this.statusCode = statusCode;
        this.logError = logError;
    }
}

class AuthFailedError extends Error {
    public logError: boolean;
    public statusCode: number;

    constructor(
        message: string = ERROR_MESSAGES.AUTHENTICATION_FAILED,
        statusCode: number = STATUS_CODES.AUTH_FAILED
    ) {
        super(message);

        Object.setPrototypeOf(this, AuthFailedError.prototype);

        this.statusCode = statusCode;
        this.name = this.constructor.name;
        this.logError = statusCode === STATUS_CODES.FORBIDDEN;
    }
}

export {
    ValidationError,
    OperationalError,
    NotFoundError,
    AuthFailedError,
};
