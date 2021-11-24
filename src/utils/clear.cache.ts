import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { Cache } from 'cache-manager';
@Injectable()
export class ClearCache{
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache){}
    async clearCache(cachekey:string) {
      const keys: string[] = await this.cacheManager.store.keys();
      keys.forEach((key) => {
      if (key.startsWith(cachekey)) {
            this.cacheManager.del(key);
          }
      })
    }
    async getCache(cachekey:string){
      const keys: string[] = await this.cacheManager.store.keys();
        keys.forEach((key) => {
          if (key.startsWith(cachekey)) {
            const temp=this.cacheManager.get(key);
            console.log(temp);
          }
        })
    }
}