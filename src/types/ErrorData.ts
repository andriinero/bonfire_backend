import { ValidationError } from 'express-validator';

export type ErrorData = {
  message: string;
  errors?: ValidationError[];
};
