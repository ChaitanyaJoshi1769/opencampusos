import { Request, Response, NextFunction } from 'express';
import { v4 as uuid } from 'uuid';

export function RequestIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const requestId = req.get('X-Request-ID') || uuid();
  (req as any).id = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
}
