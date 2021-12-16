import { ObjectId } from "mongoose";
import * as mongoose from 'mongoose';
import { User } from "./User.Schema";
export declare type OTPDocument = OTP & Document;
export declare class OTP {
    _id: ObjectId;
    phoneNumber: string;
    userId: User;
    isPhoneNumberConfirmed: boolean;
    isVerifyOtp: Date;
    code: string;
}
export declare const OTPSchema: mongoose.Schema<mongoose.Document<OTP, any, any>, mongoose.Model<mongoose.Document<OTP, any, any>, any, any, any>, {}>;
