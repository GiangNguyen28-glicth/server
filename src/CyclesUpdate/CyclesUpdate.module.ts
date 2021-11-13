import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CyclesUpdateController } from "./CyclesUpdate.controller";
import { CyclesUpdateService } from "./CyclesUpdate.service";
import { CyclesUpdate, CyclesUpdateSchema } from "./Schema/CyclesUpdate.schema";

@Module({
    imports:[MongooseModule.forFeature([{name:CyclesUpdate.name,schema:CyclesUpdateSchema}])],
    controllers:[CyclesUpdateController],
    providers:[CyclesUpdateService],
    exports:[CyclesUpdateService]
})
export class CyclesUpdateModule{

}