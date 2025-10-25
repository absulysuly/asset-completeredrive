import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import logger from '../utils/logger.js';

export interface CustomError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error caught by error handler:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        return res.status(409).json({
          error: 'Conflict',
          message: 'A record with this unique field already exists',
          field: err.meta?.target,
        });
      case 'P2025':
        return res.status(404).json({
          error: 'Not Found',
          message: 'The requested record was not found',
        });
      case 'P2003':
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Foreign key constraint failed',
        });
      default:
        return res.status(500).json({
          error: 'Database Error',
          message: 'A database error occurred',
        });
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid data provided',
    });
  }

  // Custom status codes
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Don't expose error details in production
  const response: any = {
    error: statusCode >= 500 ? 'Internal Server Error' : err.name || 'Error',
    message,
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export class AppError extends Error implements CustomError {
  statusCode: number;
  code?: string;

  constructor(message: string, statusCode: number = 500, code?: string) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}
