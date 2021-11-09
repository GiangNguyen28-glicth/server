import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "src/decorators/getuser.decorators";
import { changePassword } from "./DTO/ChangePassword.dto";
import { ConfirmPhoneDTO } from "./DTO/ConfirmPhone.dto";
import { PhoneNumberDTO } from "./DTO/phoneNumber.dto";
import { UserDTO } from "./DTO/user.dto";
import { User } from "./Schema/User.Schema";
import { UserReponse } from "./User.Reponse";
import { UserService } from "./User.service";
@Controller()
export class UserController{
    constructor(private userservice:UserService){}
    @Post('/signup')
    async register(@Body() userdto:UserDTO):Promise<UserReponse>{
        return this.userservice.register(userdto);
    }


    @Post('/signin')
    async signin(@Body(){email,password}):Promise<{accesstoken:string}>{
        return this.userservice.Login({email,password});
    }


    @Post('/forgot-password')
    async forgotpassword(@Body() phoneNumber:PhoneNumberDTO):Promise<{accesstoken:string}>{
        return this.userservice.forgotpassword(phoneNumber.phoneNumber);
    }


    @Post('/check-verification-code')
    @UseGuards(AuthGuard())
    async checkVerificationCode(@GetUser() user:User,@Body() confirmPhonedto:ConfirmPhoneDTO) {
        return this.userservice.confirmPhoneNumber(user._id,user.phoneNumber,confirmPhonedto.code);
    }

    @Post('/change-password')
    @UseGuards(AuthGuard())
    async changePassword(@GetUser() user:User,@Body() changepassword:changePassword):Promise<UserReponse>{
        return this.userservice.changPassword(user._id,changepassword);
    }
}