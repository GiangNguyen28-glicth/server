import { Model } from "mongoose";
import { CommonService } from "src/Utils/common.service";
import { User, UserDocument } from "../Schema/User.Schema";
import { JwtPayload } from "./jwt.payload";
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private usermodel;
    private commonservice;
    constructor(usermodel: Model<UserDocument>, commonservice: CommonService);
    validate(payload: JwtPayload): Promise<User>;
}
export {};
