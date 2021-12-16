import { Body, Controller, Get, Post, Put, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "src/decorators/getuser.decorators";
import { Checkout } from "src/Paypal/DTO/checkout.dto";
import { IReponse } from "src/Utils/IReponse";
import { changePassword } from "./DTO/ChangePassword.dto";
import { ConfirmPhoneDTO } from "./DTO/ConfirmPhone.dto";
import { HistoryAction } from "./DTO/HistoryAction.obj";
import { PhoneNumberDTO } from "./DTO/phoneNumber.dto";
import { UpdateProfileDTO } from "./DTO/UpdateProfile.dto";
import { UserDTO } from "./DTO/user.dto";
import { User } from "./Schema/User.Schema";
import { UserService } from "./User.service";
@Controller()
export class UserController{
    constructor(private userservice:UserService){}
    @Post('/signup')
    async register(@Body() userdto:UserDTO):Promise<IReponse<User>>{
        return await this.userservice.register(userdto);
    }

    @Post('/signin')
    async signin(@Body(){email,password}):Promise<{accesstoken:string}>{
        return this.userservice.Login({email,password});
    }

    @Put('/updateprofile')
    @UseGuards(AuthGuard())
    async updateprofile(@Body() updatepfl:UpdateProfileDTO,@GetUser() user:User):Promise<IReponse<User>>{
        return this.userservice.updateProfile(updatepfl,user._id);
    }

    @Post('/forgot-password')
    async forgotpassword(@Body() phoneNumber:PhoneNumberDTO):Promise<void>{
        return this.userservice.forgotpassword(phoneNumber.phoneNumber);
    }


    @Post('/check-verification-code')
    async checkVerificationCode(@GetUser() user:User,@Body() confirmPhonedto:ConfirmPhoneDTO) {
        return this.userservice.confirmPhoneNumber(confirmPhonedto.code);
    }

    @Put('/change-password')
    @UseGuards(AuthGuard())
    async changePassword(@GetUser() user:User,@Body() changepassword:changePassword):Promise<IReponse<User>>{
        return this.userservice.changPassword(user._id,changepassword);
    }
    @Put('/update-password')
    @UseGuards(AuthGuard())
    async updatePassword(@Body() changepassword:changePassword,@GetUser()user:User):Promise<IReponse<User>>{
        return this.userservice.updatePassword(changepassword,user);
    }

    @Post('/addmoney')
    @UseGuards(AuthGuard())
    async Addmoney(@Body() checkout:Checkout,@GetUser()user:User):Promise<IReponse<User>>{
        return this.userservice.NaptienATM(checkout,user)
    }

    @Get('/getalltransaction')
    @UseGuards(AuthGuard())
    async GetAllTransaction(@GetUser() user:User):Promise<[HistoryAction]>{
        return this.userservice.getAllTransaction(user);
    }
}