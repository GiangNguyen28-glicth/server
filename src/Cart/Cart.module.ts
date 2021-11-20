import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SavingsDepositModule } from "src/SavingsDeposit/savingsdeposit.module";
import { UserModule } from "src/User/User.module";
import { CartController } from "./Cart.controller";
import { CartService } from "./Cart.service";
import { Cart, CartSchema } from "./Schema/Cart.schema";

@Module({
    imports:[MongooseModule.forFeature([{name:Cart.name,schema:CartSchema}]),UserModule,SavingsDepositModule],
    controllers:[CartController],
    providers:[CartService],
})
export class CartModule{

}