import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CyclesController } from "./Cycles.controller";
import { CyclesService } from "./Cycles.service";
import { Cycles, CyclesSchema } from "./Schema/Cycles.chema";

@Module({
    imports:[MongooseModule.forFeature([{name:Cycles.name,schema:CyclesSchema}])],
    controllers:[CyclesController],
    providers:[CyclesService],
})
export class CyclesModule{
    
}