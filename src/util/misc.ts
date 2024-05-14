/**
 * Miscellaneous shared functions go here.
 */

import { TErrorData } from '@src/types/ErrorData';
import { TQueryOptions } from '@src/types/TQueryOptions';
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
  } as TErrorData;
};

export const getQueryOpts = <T>(opts?: TQueryOptions<T>) => {
  const defaultOptions = {
    limit: 25,
    page: 0,
    ...opts,
  };

  return defaultOptions;
};
