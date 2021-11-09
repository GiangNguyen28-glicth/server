import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Transform, Type } from "class-transformer";
import { ObjectId } from "mongoose";
import { SavingsDeposit } from "src/Deposit/Schema/SavingsDeposit.Schema";
import { UserRole } from "../DTO/user.dto";
import * as mongoose from 'mongoose';
export type UserDocument=User & Document;
@Schema({
    toJSON: {
      getters: true,
      virtuals: true,
    },
})
export class User{
    @Transform(({value})=>value.toString())
    _id:ObjectId;
    @Prop()
    firstName:string;
    @Prop()
    lastName:string;
    @Prop()
    password?:string;
    @Prop()
    phoneNumber:string;
    @Prop()
    email:string;
    @Prop({default:false})
    isEmailConfirmed?:boolean;
    @Prop()
    CMND:string;
    @Prop({type:Date, default: Date.now,expires:10})
	createdAt?: Date
    @Prop()
    role:UserRole;
    @Prop({type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SavingsDeposit' }],default:[]})
    @Type(()=>SavingsDeposit)
    savingsDeposit?:SavingsDeposit[];
    fullName?:string;
}
const UserSchema=SchemaFactory.createForClass(User);
UserSchema.virtual('fullName').get(function (this: UserDocument) {
    return `${this.firstName} ${this.lastName}`;});
export { UserSchema };