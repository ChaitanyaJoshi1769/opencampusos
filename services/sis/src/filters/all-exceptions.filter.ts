import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = 'INTERNAL_ERROR';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object') {
        const objResponse = exceptionResponse as Record<string, unknown>;
        message = (objResponse.message as string) || message;
        code = (objResponse.code as string) || this.statusCodeToErrorCode(status);
      } else {
        message = exceptionResponse;
        code = this.statusCodeToErrorCode(status);
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const errorResponse = {
      status: 'error',
      error: {
        code,
        message,
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: (request as any).id,
        path: request.url,
      },
    };

    response.status(status).json(errorResponse);
  }

  private statusCodeToErrorCode(status: number): string {
    const codeMap: Record<number, string> = {
      400: 'VALIDATION_ERROR',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      500: 'INTERNAL_ERROR',
    };
    return codeMap[status] || 'INTERNAL_ERROR';
  }
}
