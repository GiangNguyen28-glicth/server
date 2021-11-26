import { Body, Controller, Get, Param, Post, Put, Query } from "@nestjs/common";
import { newOptionDTO } from "./DTO/newOption.dto";
import { OptionDTO } from "./DTO/Option.dto";
import { OptionService } from "./Option.service";
import { Option } from "./Schema/Option.chema";

@Controller('/option')
export class OptionController{
    constructor(private optionService:OptionService){}
    @Post('/saveOption')
    async saveOption(@Body()optiondto:OptionDTO):Promise<Option>{
        return this.optionService.saveoption(optiondto);
    }
    // @Get('/findall/:id')
    // async findAll(@Param('id')id):Promise<Cycles>{
    //     return this.cyclesService.test(id);
    // }
    @Get('/findall')
    async findAllOption():Promise<Option[]>{
        return this.optionService.findAllOption();
    }

    @Put('/updateOption/:id')
    async updateOption(@Param('id') id,@Body() newoptiondto:newOptionDTO):Promise<Option>{

        return this.optionService.updatenewOption(id,newoptiondto);
    }

    @Get('/getvalueoption')
    async GetValueOption(@Body() option:newOptionDTO):Promise<number>{
        let date=new Date();
        console.log(await this.optionService.GetValueOption(date,option.option));
        return await this.optionService.GetValueOption(date,option.option);
    }

    @Get('/getoptionvaluebyYear')
    async GetCurrentOptionValue(@Query('year') Year:number){
        const temp=Number(Year);
        return this.optionService.GetValueByYear(temp);
    }
}