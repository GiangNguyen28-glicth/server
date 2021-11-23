import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Transform, Type } from "class-transformer";
import { ObjectId } from "mongoose";
import * as mongoose from 'mongoose';
import { PassBook } from "src/PassBook/Schema/PassBook.Schema";
export type CyclesUpdateDocument=CyclesUpdate & Document;
@Schema()
export class CyclesUpdate{
    @Transform(({value})=>value.toString())
    _id:ObjectId;
    @Prop()
    value:number;
    @Prop({type:Number})
    currentMoney:Number;
    @Prop({type:Date})
    startDate:Date; // ngay bat dau chu ki moi
    @Prop({type:Date})
    endDate:Date; // 1 thang sau start date
    @Prop({type:mongoose.Schema.Types.ObjectId,ref:'PassBook'})
    passbookId:ObjectId;
}
export const CyclesUpdateSchema=SchemaFactory.createForClass(CyclesUpdate);