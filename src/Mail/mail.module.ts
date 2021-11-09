import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "../User/User.module";
import { MailController } from "./mail.controller";
import { MailService } from "./mail.service";

@Module({
    imports:[forwardRef(() => UserModule),JwtModule.register({})],
    controllers:[MailController],
    providers:[MailService],
    exports:[MailService]
})
export class MailModule{

}