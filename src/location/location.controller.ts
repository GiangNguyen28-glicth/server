import { Controller, Get, Param } from "@nestjs/common";
import { LocationService } from "./location.service";

@Controller('/location')
export class LocationController{
    constructor(private location:LocationService){}
    @Get('/province')
    async findAll():Promise<any>{
        return this.location.findProvince();
    }
    @Get('/district/:code')
    async findDistrict(@Param('code') code):Promise<any>{
        return this.location.findDistrict(code);
    }
    @Get('/wards/:code')
    async findWards(@Param('code')code):Promise<any>{
        return this.location.findWards(code);
    }
}