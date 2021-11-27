import { Controller, Get, Param } from "@nestjs/common";
import { LocationService } from "./location.service";

@Controller('/location')
export class LocationController{
    constructor(private location:LocationService){}
    @Get('/province')
    findAll(){
        return this.location.findProvince();
    }
    @Get('/district/:code')
    findDistrict(@Param('code') code):any{
        return this.location.findDistrict(code);
    }
    @Get('/wards/:code')
    findWards(@Param('code')code):any{
        return this.location.findWards(code);
    }
}