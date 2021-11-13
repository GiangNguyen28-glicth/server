import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Transform, Type } from "class-transformer";
import { ObjectId } from "mongoose";;
import { UserRole } from "../DTO/user.dto";
import * as mongoose from 'mongoose';
import { SavingsDeposit } from "src/SavingsDeposit/Schema/SavingsDeposit.Schema";
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

    @Prop({unique:true})
    phoneNumber:string;

    @Prop({unique:true})
    email:string;

    @Prop({default:0})
    currentMoney?:Number;
    
    @Prop({default:false})
    isEmailConfirmed?:boolean;

    @Prop({unique:true})
    CMND:string;

    @Prop({type:Date, default: Date.now,expires:10})
	isExprise?: Date

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