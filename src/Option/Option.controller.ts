import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { hasRoles } from "src/decorators/role.decorators";
import { RolesGuard } from "src/decorators/role.guard";
import { UserRole } from "src/User/DTO/user.dto";
import { newOptionDTO } from "./DTO/newOption.dto";
import { OptionDTO } from "./DTO/Option.dto";
import { OptionService } from "./Option.service";
import { Option } from "./Schema/Option.chema";

@Controller('/option')
export class OptionController{
    constructor(private optionService:OptionService){}
    
    @hasRoles(UserRole.ADMIN)
    @UseGuards(AuthGuard(),RolesGuard)
    @Post('/saveOption')
    async saveOption(@Body()optiondto:OptionDTO):Promise<Option>{
        return this.optionService.saveoption(optiondto);
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(AuthGuard(),RolesGuard)
    @Get('/findall')
    async findAllOption():Promise<Option[]>{
        return this.optionService.findAllOption();
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(AuthGuard(),RolesGuard)
    @Put('/updateOption/:id')
    async updateOption(@Param('id') id,@Body() newoptiondto:newOptionDTO):Promise<Option>{
        return this.optionService.updatenewOption(id,newoptiondto);
    }

    @Get('/getvalueoption')
    async GetValueOption(@Body() option:newOptionDTO):Promise<number>{
        let date=new Date();
        return await this.optionService.GetValueOption(date,option.option);
    }

    @Get('/getcurrentoption')
    async GetCurrentOptionValue(){
        return this.optionService.getCurrentValueOption();
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(AuthGuard(),RolesGuard)
    @Get('/getoptionbydatetime/:datetime')
    async getValueByDateTime(@Param('datetime') datetime):Promise<any>{
        return this.optionService.GetValueByDateTime(datetime);
    }
}