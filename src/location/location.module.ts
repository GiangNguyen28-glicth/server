import { Module } from "@nestjs/common";
import { LocationController } from "./location.controller";
import { LocationService } from "./location.service";

@Module({
    imports:[],
    controllers:[LocationController],
    providers:[LocationService],

})
export class LocationModule{

}