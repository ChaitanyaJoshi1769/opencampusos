import { Request, Response, NextFunction } from 'express';
import { HttpException, HttpStatus } from '@nestjs/common';

export function TenantMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Allow certain paths to be accessed without tenant
  const publicPaths = ['/health', '/metrics', '/docs', '/graphql'];
  if (publicPaths.some((p) => req.path.includes(p))) {
    return next();
  }

  const tenantId = req.get('X-Tenant-ID');

  if (!tenantId) {
    throw new HttpException(
      {
        code: 'MISSING_TENANT',
        message: 'X-Tenant-ID header is required',
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  (req as any).tenantId = tenantId;
  res.setHeader('X-Tenant-ID', tenantId);
  next();
}
