import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Transform, Type } from "class-transformer";
import { ObjectId } from "mongoose";
import * as mongoose from 'mongoose';
import { User } from "./User.Schema";
export type OTPDocument=OTP&Document;
@Schema()
export class OTP{
    @Transform(({value})=>value.toString())
    _id:ObjectId;

    @Prop()
    phoneNumber:string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    @Type(()=>User)
    userId:ObjectId;

    @Prop({default:false})
    isPhoneNumberConfirmed:boolean;

    @Prop({type:Date,default:Date.now,expires:60*60*5})
    isVerifyOtp:Date;

    @Prop()
    code:string;
}
export const OTPSchema=SchemaFactory.createForClass(OTP);