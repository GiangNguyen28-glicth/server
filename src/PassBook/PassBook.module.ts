import { CacheModule,forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "src/User/User.module";
import { OptionModule } from "src/Option/Option.module";
import { PassBookController } from "./PassBook.controller";
import { PassBook, PassBookSchema } from "./Schema/PassBook.Schema";
import { PassBookService } from "./PassBook.service";
import { ClearCache } from "src/Utils/clear.cache";

@Module({
    imports:[MongooseModule.forFeature([{name:PassBook.name,schema:PassBookSchema}]),
    forwardRef(()=>UserModule),OptionModule,CacheModule.register()],
    controllers:[PassBookController],
    providers:[PassBookService,ClearCache],
    exports:[PassBookService]
})
export class PassBookModule{

}