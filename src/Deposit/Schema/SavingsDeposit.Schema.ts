import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Transform } from "class-transformer";
import { Date, ObjectId } from "mongoose";
export type SavingsDepositDocument=SavingsDeposit & Document;
@Schema()
export class SavingsDeposit{
    @Transform(({value})=>value.toString())
    _id:ObjectId;

    @Prop()
    deposits:string;

    @Prop({ type : Date, default: Date.now })
    startDate:Date;

    @Prop({type:Date})
    endDate:Date; 
}
export const SavingsDepositSchema=SchemaFactory.createForClass(SavingsDeposit);