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
    forgotpassword(phoneNumber: PhoneNumberDTO): Promise<void>;
    checkVerificationCode(user: User, confirmPhonedto: ConfirmPhoneDTO): Promise<{
        accessToken: any;
    }>;
    changePassword(user: User, changepassword: changePassword): Promise<IReponse<User>>;
    updatePassword(changepassword: changePassword, user: User): Promise<IReponse<User>>;
    Addmoney(checkout: Checkout, user: User): Promise<IReponse<User>>;
    GetAllTransaction(user: User): Promise<[HistoryAction]>;
    getUser(id: any): Promise<any>;
}
