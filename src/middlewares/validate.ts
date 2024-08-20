import Joi, { ObjectSchema } from 'joi';
import { pick } from '../utils/universalFunctions';
import { ValidationError } from '../utils/error';
import config from '../config/config';
import { Request, Response, NextFunction } from 'express';

interface Schema {
  [key: string]: ObjectSchema;
}

const validate = (schema: Schema) => (req: Request, res: Response, next: NextFunction) => {
  const validSchema = pick(schema, ['params', 'query', 'body', 'files']);

  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' } })
    .validate(object, { abortEarly: false });

  if (error) {
    let errorMessage = error.details
      .map((details) => details.message)
      .join(', ')
      .replace(/"/g, '');
    return next(new ValidationError(errorMessage));
  }

  Object.assign(req, value);
  return next();
};

const validateView = (schema: Schema) => (req: Request, res: Response, next: NextFunction) => {
  const validSchema = pick(schema, ['params', 'query', 'body', 'files']);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
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

export { validate, validateView };
