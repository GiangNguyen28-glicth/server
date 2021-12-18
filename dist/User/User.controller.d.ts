import { Checkout } from "src/Paypal/DTO/checkout.dto";
import { IReponse } from "src/Utils/IReponse";
import { changePassword } from "./DTO/ChangePassword.dto";
import { ConfirmPhoneDTO } from "./DTO/ConfirmPhone.dto";
import { HistoryAction } from "./DTO/HistoryAction.obj";
import { UpdateProfileDTO } from "./DTO/UpdateProfile.dto";
import { UserDTO } from "./DTO/user.dto";
import { User } from "./Schema/User.Schema";
import { UserService } from "./User.service";
import { Response } from 'express';
export declare class UserController {
    private userservice;
    constructor(userservice: UserService);
    register(userdto: UserDTO): Promise<IReponse<User>>;
    signin({ email, password }: {
        email: any;
        password: any;
    }): Promise<{
        accesstoken: string;
    }>;
    updateprofile(updatepfl: UpdateProfileDTO, user: User): Promise<IReponse<User>>;
    forgotpassword({ email }: {
        email: any;
    }): Promise<void>;
    checkVerificationCode(user: User, confirmPhonedto: ConfirmPhoneDTO): Promise<{
        accessToken: any;
    }>;
    changePassword(user: User, changepassword: changePassword): Promise<IReponse<User>>;
    updatePassword(changepassword: changePassword, user: User): Promise<IReponse<User>>;
    Addmoney(checkout: Checkout, user: User): Promise<IReponse<User>>;
    GetAllTransaction(user: User): Promise<[HistoryAction]>;
    getUser(id: any): Promise<any>;
    getUserbyToken(user: User): Promise<User>;
    LoginAsAdministrator({ email, password }: {
        email: any;
        password: any;
    }): Promise<any>;
    getListUser(): Promise<User[]>;
    getmoneybymonth(): Promise<number>;
    getnewuser(): Promise<any>;
    logOut(response: Response): Promise<Response<any, Record<string, any>>>;
}
