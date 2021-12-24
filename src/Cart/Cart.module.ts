import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MailModule } from "src/Mail/mail.module";
import { MailService } from "src/Mail/mail.service";
import { OptionModule } from "src/Option/Option.module";
import { PassBookModule} from "src/PassBook/PassBook.module";
import { UserModule } from "src/User/User.module";
import { CommonService } from "src/Utils/common.service";
import { CartController } from "./Cart.controller";
import { CartService } from "./Cart.service";
import { Cart, CartSchema } from "./Schema/Cart.schema";

@Module({
    imports:[MongooseModule.forFeature([{name:Cart.name,schema:CartSchema}]),UserModule,PassBookModule,OptionModule,forwardRef(()=>MailModule)],
    controllers:[CartController],
    providers:[CartService],
})
export class CartModule{

}