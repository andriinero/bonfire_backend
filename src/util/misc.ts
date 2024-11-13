/**
 * Miscellaneous shared functions go here.
 */

import { ErrorData } from '@src/types/ErrorData';
import { Result, ValidationError } from 'express-validator';

const VALIDATION_ERROR_MESSAGE = 'Validation error';

/**
 * Get a random number between 1 and 1,000,000,000,000
 */
export function getRandomInt(): number {
  return Math.floor(Math.random() * 1_000_000_000_000);
}

/**
 * Wait for a certain number of milliseconds.
 */
export function tick(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
}

export const formatValidationErrors = (result?: Result<ValidationError>) => {
  return {
    message: VALIDATION_ERROR_MESSAGE,
    errors: result?.array() ?? [],
  } as ErrorData;
};
