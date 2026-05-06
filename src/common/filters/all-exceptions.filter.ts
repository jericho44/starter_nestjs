import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseMessage =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    let messageStr = 'Error';
    let errorsObj: unknown = null;

    if (typeof responseMessage === 'string') {
      messageStr = responseMessage;
    } else if (
      typeof responseMessage === 'object' &&
      responseMessage !== null
    ) {
      const msgObj = responseMessage as Record<string, unknown>;
      if (typeof msgObj.message === 'string') {
        messageStr = msgObj.message;
      }
      errorsObj = msgObj.error || responseMessage;
    }

    const errorResponse = {
      success: false,
      message: messageStr,
      data: null,
      errors: errorsObj,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    this.logger.error(
      `${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : JSON.stringify(exception),
    );

    response.status(status).json(errorResponse);
  }
}
