import { CacheModule, forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RolesGuard } from "src/decorators/role.guard";
import { PassBookModule } from "src/PassBook/PassBook.module";
import { UserModule } from "src/User/User.module";
import { UserService } from "src/User/User.service";
import { CommonService } from "src/Utils/common.service";
import { OptionController } from "./Option.controller";
import { OptionService } from "./Option.service";
import { OptionSchema,Option } from "./Schema/Option.chema";

@Module({
    imports:[MongooseModule.forFeature([{name:Option.name,schema:OptionSchema}]),CacheModule.register(),
    forwardRef(()=>UserModule),forwardRef(()=>PassBookModule)],
    controllers:[OptionController],
    providers:[OptionService,CommonService],
    exports:[OptionService]
})
export class OptionModule{
    
}