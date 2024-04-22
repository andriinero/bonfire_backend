import { ValidationError } from 'express-validator';

export type TErrorData =
  | { message: string }
  | {
      message: string;
      errors: ValidationError[];
    };
