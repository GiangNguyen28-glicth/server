import { Module } from "@nestjs/common";
import { UserModule } from "src/User/User.module";
import { PaypalController } from "./Paypal.controller";
import { PaypalService } from "./Paypay.service";

@Module({
    imports:[UserModule],
    controllers:[PaypalController],
    providers:[PaypalService],
})
export class PaypalModule{

}
