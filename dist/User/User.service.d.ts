import { Model } from "mongoose";
import { UserDTO } from "./DTO/user.dto";
import { User, UserDocument } from "./Schema/User.Schema";
import { MailService } from "src/Mail/mail.service";
import { JwtService } from "@nestjs/jwt";
import { OTP, OTPDocument } from "src/User/Schema/sms.schema";
import { TwilioClient } from "nestjs-twilio";
import { changePassword } from "./DTO/ChangePassword.dto";
import { IReponse } from "src/Utils/IReponse";
import * as mongoose from 'mongoose';
import { UpdateProfileDTO } from "./DTO/UpdateProfile.dto";
import { HistoryAction } from "./DTO/HistoryAction.obj";
import { Checkout } from "src/Paypal/DTO/checkout.dto";
import { PassBookService } from "src/PassBook/PassBook.service";
import { PassBook } from "src/PassBook/Schema/PassBook.Schema";
export declare class UserService {
    private usermodel;
    private otpmodel;
    private readonly twilioClient;
    private readonly connection;
    private passbookservice;
    private mailservice;
    private jwtservice;
    constructor(usermodel: Model<UserDocument>, otpmodel: Model<OTPDocument>, twilioClient: TwilioClient, connection: mongoose.Connection, passbookservice: PassBookService, mailservice: MailService, jwtservice: JwtService);
    register(userdto: UserDTO): Promise<IReponse<User>>;
    deleteUser(id: any): Promise<IReponse<User>>;
    updateProfile(updateprofile: UpdateProfileDTO, id: any): Promise<IReponse<User>>;
    getByEmail(email: string): Promise<User>;
    markEmailAsConfirmed(email: string): Promise<User>;
    getByID(id: any): Promise<User>;
    Login({ email, password }: {
        email: any;
        password: any;
    }): Promise<{
        accesstoken: string;
    }>;
    forgotpassword(phoneNumber: string): Promise<{
        accesstoken: string;
    }>;
    sendSMS(phoneNumber: string): Promise<import("twilio/lib/rest/verify/v2/service/verification").VerificationInstance>;
    confirmPhoneNumber(userId: any, phoneNumber: string, verificationCode: string): Promise<void>;
    markPhoneNumberAsConfirmed(userId: any): Promise<mongoose.Document<any, any, OTPDocument> & OTP & Document & {
        _id: mongoose.Schema.Types.ObjectId;
    }>;
    changPassword(userId: any, changepassword: changePassword): Promise<IReponse<User>>;
    updateSvd(input: PassBook, user: User): Promise<void>;
    updatePassword(changepassword: changePassword, user: User): Promise<IReponse<User>>;
    updateMoney(action: string, money: number, user: User): Promise<void>;
    updateNewAction(historyaction: HistoryAction, user: User): Promise<void>;
    NaptienATM(checkout: Checkout, user: User): Promise<IReponse<User>>;
    getAllTransaction(user: User): Promise<[HistoryAction]>;
}
