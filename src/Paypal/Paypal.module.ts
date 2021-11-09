import { Module } from "@nestjs/common";
import { PaypalController } from "./Paypal.controller";
import { PaypalService } from "./Paypay.service";

@Module({
    imports:[],
    controllers:[PaypalController],
    providers:[PaypalService],
})
export class PaypalModule{

}
