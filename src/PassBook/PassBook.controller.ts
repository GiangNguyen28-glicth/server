import { Body, CacheInterceptor, CacheKey, CacheTTL, Controller, Get, Param, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "src/decorators/getuser.decorators";
import { User } from "src/User/Schema/User.Schema";
import { IReponse } from "src/Utils/IReponse";
import { CachKeyPassbook } from "./DTO/cache.key.dto";
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
    @Get('/check/:id')
    @UseInterceptors(CacheInterceptor)
    @CacheKey(CachKeyPassbook.GET_PASSBOOK_CACHE_KEY_TOTAL_PROFIT)
    @CacheTTL(1220)
    async getTotalCycles(@Param('id') id):Promise<any>{
        return this.passbookservice.getTotalCycles(id);
    }

    @UseInterceptors(CacheInterceptor)
    @CacheKey(CachKeyPassbook.GET_PASSBOOK_CACHE_KEY_TOTAL_PASSBOOK)
    @CacheTTL(1220)
    @Get('/getpassbook')
    async getPassbook(@GetUser() user:User):Promise<any>{
        return this.passbookservice.GetAllPassbookByUserId(user);
    }

 
    @Get('/getpassbookisactive')
    async getPassbookIsActive(@GetUser() user:User):Promise<any>{
        return this.passbookservice.GetPassbookIsActive(user);
    }

    @Get('/getpassbookbyid/:id')
    async GetPassbookById(@GetUser() user:User,@Param('id') id):Promise<PassBook>{
        return this.passbookservice.GetPassBookById(id,user);
    }
}
