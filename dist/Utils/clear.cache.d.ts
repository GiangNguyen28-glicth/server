import { Cache } from 'cache-manager';
export declare class ClearCache {
    private cacheManager;
    constructor(cacheManager: Cache);
    clearCache(cachekey: string): Promise<void>;
}
