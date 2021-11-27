import { Module } from "@nestjs/common";
import { UserModule } from "src/User/User.module";
import { CommonService } from "src/Utils/common.service";
import { PaypalController } from "./Paypal.controller";
import { PaypalService } from "./Paypay.service";

@Module({
    imports:[UserModule],
    controllers:[PaypalController],
    providers:[PaypalService,CommonService],
})
export class PaypalModule{

}
