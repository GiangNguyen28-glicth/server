import { Model } from "mongoose";
import { User, UserDocument } from "../Schema/User.Schema";
import { JwtPayload } from "./jwt.payload";
import { Request } from "express";
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private usermodel;
    constructor(usermodel: Model<UserDocument>);
    validate(payload: JwtPayload, request: Request): Promise<User>;
}
export {};
