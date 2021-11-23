"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpCacheInterceptor = void 0;
const common_1 = require("@nestjs/common");
let HttpCacheInterceptor = class HttpCacheInterceptor extends common_1.CacheInterceptor {
    trackBy(context) {
        const cacheKey = this.reflector.get(common_1.CACHE_KEY_METADATA, context.getHandler());
        if (cacheKey) {
            const request = context.switchToHttp().getRequest();
            return `${cacheKey}-${request._parsedUrl.query}`;
        }
        return super.trackBy(context);
    }
};
HttpCacheInterceptor = __decorate([
    (0, common_1.Injectable)()
], HttpCacheInterceptor);
exports.HttpCacheInterceptor = HttpCacheInterceptor;
//# sourceMappingURL=httpCache.interceptor.js.map