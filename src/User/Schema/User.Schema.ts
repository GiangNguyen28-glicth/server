import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Transform, Type } from "class-transformer";
import { ObjectId } from "mongoose";;
import { UserRole } from "../DTO/user.dto";
import { HistoryAction } from "../DTO/HistoryAction.obj";
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
    currentMoney?:number;
    
    @Prop({default:false})
    isEmailConfirmed?:boolean;

    @Prop()
    CMND:string;

    @Prop({type:Object})
    address:string;

    @Prop({type:Date, default: Date.now,expires:60*60*5})
	isExprise?: Date

    @Prop({type:Date})
    isChangePassword?:Date;
    @Prop()
    role:UserRole;
    @Prop()
    historyaction?:[HistoryAction];
    fullName?:string;
}
const UserSchema=SchemaFactory.createForClass(User);
UserSchema.virtual('fullName').get(function (this: UserDocument) {
    return `${this.firstName} ${this.lastName}`;});
export { UserSchema };