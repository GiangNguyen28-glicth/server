import { ObjectId } from "mongoose";
import { UserRole } from "../DTO/user.dto";
import { HistoryAction } from "../DTO/HistoryAction.obj";
import { AdddressDTO } from "../DTO/Address.dto";
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
    address: AdddressDTO;
    isExprise?: Date;
    isChangePassword?: Date;
    role: UserRole;
    historyaction?: [HistoryAction];
    fullName?: string;
}
declare const UserSchema: import("mongoose").Schema<import("mongoose").Document<User, any, any>, import("mongoose").Model<import("mongoose").Document<User, any, any>, any, any, any>, {}>;
export { UserSchema };
