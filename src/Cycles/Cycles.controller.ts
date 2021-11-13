import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CyclesService } from "./Cycles.service";
import { CyclesDTO } from "./DTO/Cycles.dto";
import { Cycles } from "./Schema/Cycles.chema";

@Controller('/cycles')
export class CyclesController{
    constructor(private cyclesService:CyclesService){}
    @Post('/saveCycles')
    async saveCycles(@Body()cyclesdto:CyclesDTO):Promise<Cycles>{
        return this.cyclesService.saveCycles(cyclesdto);
    }
    @Get('/findall/:id')
    async findAll(@Param('id')id):Promise<Cycles>{
        return this.cyclesService.test(id);
    }
}