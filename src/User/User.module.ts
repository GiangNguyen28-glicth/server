import { CacheModule, forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";
import { MailModule } from "../Mail/mail.module";
import { RolesGuard } from "../decorators/role.guard";
import { User, UserSchema } from "./Schema/User.Schema";
import { UserController } from "./User.controller";
import { UserService } from "./User.service";
import { OTP, OTPSchema } from "./Schema/sms.schema";
import { JwtStrategy } from "./JWT/jwt.strategy";
import { PassBookModule } from "src/PassBook/PassBook.module";
import { CommonService } from "src/Utils/common.service";
@Module({
    imports:[forwardRef(() =>MailModule),forwardRef(()=>PassBookModule),
        MongooseModule.forFeature([{name:User.name,schema:UserSchema}]),
        MongooseModule.forFeature([{name:OTP.name,schema:OTPSchema}]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret:'topSecret51',
          signOptions:{
            expiresIn: 3600,
          }
        }),CacheModule.register(),CommonService],
    controllers:[UserController],
    providers:[UserService,RolesGuard,JwtStrategy,CommonService],
    exports: [UserService,JwtStrategy, PassportModule]
})
export class UserModule{

}