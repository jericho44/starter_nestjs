import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data: unknown) => {
        let message = 'Operation successful';
        let resultData = data;

        if (data !== null && typeof data === 'object') {
          const dataObj = data as Record<string, unknown>;
          if ('message' in dataObj && typeof dataObj.message === 'string') {
            message = dataObj.message;
          }
          if ('data' in dataObj) {
            resultData = dataObj.data;
          }
        }

        return {
          success: true,
          message,
          data: resultData as T,
        };
      }),
    );
  }
}
