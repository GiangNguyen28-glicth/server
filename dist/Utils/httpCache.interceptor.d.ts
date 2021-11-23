import { CacheInterceptor, ExecutionContext } from '@nestjs/common';
export declare class HttpCacheInterceptor extends CacheInterceptor {
    trackBy(context: ExecutionContext): string | undefined;
}
