import { CacheModule, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { OptionController } from "./Option.controller";
import { OptionService } from "./Option.service";
import { OptionSchema,Option } from "./Schema/Option.chema";

@Module({
    imports:[MongooseModule.forFeature([{name:Option.name,schema:OptionSchema}]),CacheModule.register()],
    controllers:[OptionController],
    providers:[OptionService],
    exports:[OptionService]
})
export class OptionModule{
    
}