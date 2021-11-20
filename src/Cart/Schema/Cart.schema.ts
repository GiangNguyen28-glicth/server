import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Transform } from "class-transformer";
import { ObjectId } from "mongoose";
import * as mongoose from 'mongoose';
export type CartDocument=Cart & Document;
@Schema()
export class Cart{

    @Transform(({value})=>value.toString())
    _id:ObjectId;
    @Prop({type:mongoose.Schema.Types.ObjectId,ref:'User'})
    userId:ObjectId;
    @Prop()
    option:number;
    @Prop({type:Date,default:Date.now})
    startDate:Date;
    @Prop({type:Date})
    endDate:Date;
    @Prop()
    deposits:number; // tien gui
    @Prop()
    totalProfit:number; // tong loi nhuan

}
export const CartSchema=SchemaFactory.createForClass(Cart);