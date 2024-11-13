import { ValidationError } from 'express-validator';

export type ErrorData =
  | { message: string }
  | {
      message: string;
      errors: ValidationError[];
    };
