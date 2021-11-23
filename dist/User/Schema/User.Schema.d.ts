import { ObjectId } from "mongoose";
import { UserRole } from "../DTO/user.dto";
import * as mongoose from 'mongoose';
import { HistoryAction } from "../DTO/HistoryAction.obj";
export declare type UserDocument = User & Document;
export declare class User {
    _id: ObjectId;
    firstName: string;
    lastName: string;
    password?: string;
    phoneNumber: string;
    email: string;
    currentMoney?: number;
    isEmailConfirmed?: boolean;
    CMND: string;
    isExprise?: Date;
    role: UserRole;
    historyaction?: [HistoryAction];
    fullName?: string;
}
declare const UserSchema: mongoose.Schema<mongoose.Document<User, any, any>, mongoose.Model<mongoose.Document<User, any, any>, any, any, any>, {}>;
export { UserSchema };
