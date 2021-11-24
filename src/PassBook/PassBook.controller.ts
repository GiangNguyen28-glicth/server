import { Body, CacheInterceptor, CacheKey, CacheTTL, Controller, Get, Param, Post, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "src/decorators/getuser.decorators";
import { User } from "src/User/Schema/User.Schema";
import { IReponse } from "src/Utils/IReponse";
import { CacheKeyPassbook } from "./DTO/cache.key.dto";
import { PassBookDTO } from "./DTO/PassBook.dto";
import { PassBookService } from "./PassBook.service";
import { PassBook } from "./Schema/PassBook.Schema";

@Controller('/passbook')
@UseGuards(AuthGuard())
export class PassBookController{
    constructor(private passbookservice:PassBookService){}
    @Post('/save')
    async saveSavingdeposit(@Body() passbookdto:PassBookDTO,@GetUser() user:User):Promise<IReponse<PassBook>>{
        passbookdto.userId=user._id;
        return this.passbookservice.saveSavingsdeposit(passbookdto,user)
    }
   
    // @UseInterceptors(CacheInterceptor)
    // @CacheKey(CachKeyPassbook.GET_PASSBOOK_CACHE_KEY_TOTAL_PROFIT)
    // @CacheTTL(1220)
    @Get('/check/:passbookid')
    async getTotalCycles(@Param('passbookid') passbookid,@GetUser() user:User):Promise<any>{
        return this.passbookservice.getTotalCycles(passbookid,user);
    }

    @UseInterceptors(CacheInterceptor)
    @CacheKey(CacheKeyPassbook.GET_PASSBOOK_CACHE_KEY_TOTAL_PASSBOOK)
    @CacheTTL(1220)
    @Get('/getpassbook')
    async getPassbook(@GetUser() user:User):Promise<any>{
        return this.passbookservice.GetAllPassbookByUserId(user);
    }

    // @UseInterceptors(CacheInterceptor)
    // @CacheKey(CachKeyPassbook.GET_PASSBOOK_CACHE_KEY_IS_ACTIVE)
    // @CacheTTL(1220)
    @Get('/getpassbookisactive')
    async getPassbookIsActive(@GetUser() user:User):Promise<any>{
        return this.passbookservice.GetPassbookIsActive(user);
    }

    @Get('/getpassbookbyid/:id')
    async GetPassbookById(@GetUser() user:User,@Param('id') id):Promise<PassBook>{
        return this.passbookservice.GetPassBookById(id,user);
    }

    @Post('/withdrawMoneyPassbook/:passbookid')
    async withdrawMoneyPassbook(@GetUser() user:User,@Param('passbookid') passbookid):Promise<PassBook>{
        return this.passbookservice.withdrawMoneyPassbook(passbookid,user);
    }
}
