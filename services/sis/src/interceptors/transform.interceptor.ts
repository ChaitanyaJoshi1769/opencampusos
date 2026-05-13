import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, any>
{
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();

    return next.handle().pipe(
      map((data) => {
        // If response is already formatted, return it
        if (data && typeof data === 'object' && 'status' in data && 'data' in data) {
          return data;
        }

        // Otherwise, format it
        return {
          status: 'success',
          data,
          meta: {
            timestamp: new Date().toISOString(),
            requestId: (request as any).id,
          },
        };
      }),
    );
  }
}
