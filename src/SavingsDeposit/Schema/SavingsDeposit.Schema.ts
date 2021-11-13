import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Transform, Type } from "class-transformer";
import { Date, ObjectId } from "mongoose";
import * as mongoose from "mongoose";
import { User } from "src/User/Schema/User.Schema";
import { CyclesUpdate } from "src/CyclesUpdate/Schema/CyclesUpdate.schema";
export type SavingsDepositDocument=SavingsDeposit & Document;
@Schema()
export class SavingsDeposit{
    @Transform(({value})=>value.toString())
    _id:ObjectId;

    @Prop()
    deposits:Number; // tien gui

    @Prop({ type : Date, default: Date.now })
    startDate:Date; // ngay gui

    @Prop({type:Date,default:null})
    endDate:Date;  // ngay rut

    @Prop({type:mongoose.Schema.Types.ObjectId,ref:'User',required:true})
    @Type(()=>User)
    userId:User;

    @Prop()
    @Type(()=>CyclesUpdate)
    cyclesupdate:[CyclesUpdate];
}
export const SavingsDepositSchema=SchemaFactory.createForClass(SavingsDeposit);