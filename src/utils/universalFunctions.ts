import { Request, Response, NextFunction } from 'express';

const catchAsync = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    console.log(err);
    next(err);
  });
};

const paginationOptions = (page: number, limit: number) => {
  return { sort: { _id: -1 }, skip: page * limit, limit, lean: true };
};

const pick = (object: any, keys: string[]) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {} as Record<string, any>);
};

export { catchAsync, pick, paginationOptions };
