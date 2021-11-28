import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PassBookModule} from "src/PassBook/PassBook.module";
import { UserModule } from "src/User/User.module";
import { CommonService } from "src/Utils/common.service";
import { CartController } from "./Cart.controller";
import { CartService } from "./Cart.service";
import { Cart, CartSchema } from "./Schema/Cart.schema";

@Module({
    imports:[MongooseModule.forFeature([{name:Cart.name,schema:CartSchema}]),UserModule,PassBookModule],
    controllers:[CartController],
    providers:[CartService,CommonService],
})
export class CartModule{

}