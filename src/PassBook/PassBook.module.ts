import { CacheModule,forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "src/User/User.module";
import { OptionModule } from "src/Option/Option.module";
import { PassBookController } from "./PassBook.controller";
import { PassBook, PassBookSchema } from "./Schema/PassBook.Schema";
import { PassBookService } from "./PassBook.service";
import { CommonService } from "src/Utils/common.service";

@Module({
    imports:[MongooseModule.forFeature([{name:PassBook.name,schema:PassBookSchema}]),
    forwardRef(()=>UserModule),forwardRef(()=>OptionModule),CacheModule.register()],
    controllers:[PassBookController],
    providers:[PassBookService,CommonService],
    exports:[PassBookService]
})
export class PassBookModule{

}