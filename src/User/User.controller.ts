import { Body, Controller, Get, Param, Post, Put, Res, UseGuards} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "src/decorators/getuser.decorators";
import { hasRoles } from "src/decorators/role.decorators";
import { RolesGuard } from "src/decorators/role.guard";
import { Checkout } from "src/Paypal/DTO/checkout.dto";
import { IReponse } from "src/Utils/IReponse";
import { changePassword } from "./DTO/ChangePassword.dto";
import { ConfirmPhoneDTO } from "./DTO/ConfirmPhone.dto";
import { HistoryAction } from "./DTO/HistoryAction.obj";
import { UpdateProfileDTO } from "./DTO/UpdateProfile.dto";
import { UserDTO, UserRole } from "./DTO/user.dto";
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
    async forgotpassword(@Body() {email}):Promise<any>{
        return this.userservice.forgotpassword(email);
    }


    @Post('/check-verification-code')
    async checkVerificationCode(@Body() confirmPhonedto:ConfirmPhoneDTO) {
        return this.userservice.confirmPhoneNumber(confirmPhonedto.code);
    }

    @Put('/reset-password')
    async changePassword(@Body()changepassword:changePassword):Promise<IReponse<User>>{
        return this.userservice.changPassword(changepassword);
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

    @Get('/getuserbytoken')
    @UseGuards(AuthGuard())
    async getUserbyToken(@GetUser() user:User):Promise<User>{
        return user;
    }

    @Post('/signinAsadmin')
    async LoginAsAdministrator(@Body(){email,password}):Promise<any>{
        return await this.userservice.LoginAsAdministrtor({email,password});
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(AuthGuard(),RolesGuard)
    @Get('/getlistuser')
    async getListUser():Promise<User[]>{
        return this.userservice.getListUser();
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(AuthGuard(),RolesGuard)
    @Get('/getnewuser')
    async getnewuser():Promise<any>{
        return await this.userservice.getnewUser();
    }

    @Post('/login')
    async login(@Body(){email,password}):Promise<{accesstoken:string}>{
        return this.userservice.login({email,password});
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(AuthGuard(), RolesGuard)
    @Post('setRole')
    async setRole(@Body() { isAdmin, userId }): Promise<any> {
        return await this.userservice.setRole(isAdmin, userId);
    }
}