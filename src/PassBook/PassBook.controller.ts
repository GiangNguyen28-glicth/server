import { Body, CacheInterceptor, CacheKey, CacheTTL, Controller, Get, Param, Post, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "src/decorators/getuser.decorators";
import { hasRoles } from "src/decorators/role.decorators";
import { RolesGuard } from "src/decorators/role.guard";
import { UserRole } from "src/User/DTO/user.dto";
import { User } from "src/User/Schema/User.Schema";
import { IReponse } from "src/Utils/IReponse";
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
    // lay ra tong so tien cua so tiet kiem
    @Get('/check/:passbookid')
    async getTotalCycles(@Param('passbookid') passbookid,@GetUser() user:User):Promise<any>{
        return this.passbookservice.getTotalCycles(passbookid,user);
    }

    @Get('/getpassbook')
    async getPassbook(@GetUser() user:User):Promise<any>{
        return this.passbookservice.GetAllPassbookByUserId(user);
    }

    @Get('/getpassbookisactive')
    async getPassbookIsActive(@GetUser() user:User):Promise<any>{
        return this.passbookservice.GetPassbookIsActive(user);
    }

    @Get('/getpassbookisnotactive')
    async getPassbookIsNotActive(@GetUser() user:User):Promise<any>{
        return this.passbookservice.GetPassbookIsNotActive(user);
    }

    @Get('/getpassbookbyid/:id')
    async GetPassbookById(@GetUser() user:User,@Param('id') id):Promise<PassBook>{
        return this.passbookservice.GetPassBookById(id,user);
    }
    //rut tien
    @Post('/withdrawMoneyPassbook/:passbookid')
    async withdrawMoneyPassbook(@GetUser() user:User,@Param('passbookid') passbookid):Promise<PassBook>{
        return this.passbookservice.withdrawMoneyPassbook(passbookid,user);
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(AuthGuard(),RolesGuard)
    @Get('/getallpassbook')
    async getAllPassbook():Promise<PassBook[]>{
        return await this.passbookservice.getAllPassbook();
    }

}
