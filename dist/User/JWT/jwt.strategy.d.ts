import { Model } from "mongoose";
import { User, UserDocument } from "../Schema/User.Schema";
import { JwtPayload } from "./jwt.payload";
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private usermodel;
    constructor(usermodel: Model<UserDocument>);
    validate(payload: JwtPayload): Promise<User>;
}
export {};
