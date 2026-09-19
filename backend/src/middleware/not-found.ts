import type { NextFunction, Request, Response } from 'express';
import { ApiError, ErrorCode } from '../utils/api-error.js';

export function notFound(req: Request, _res: Response, next: NextFunction): void {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`, ErrorCode.NOT_FOUND));
}
