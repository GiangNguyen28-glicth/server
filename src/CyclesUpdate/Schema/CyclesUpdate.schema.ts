import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Transform, Type } from "class-transformer";
import { ObjectId } from "mongoose";
import * as mongoose from 'mongoose';
import { Cycles } from "src/Cycles/Schema/Cycles.chema";
export type CyclesUpdateDocument=CyclesUpdate & Document;
@Schema()
export class CyclesUpdate{
    @Transform(({value})=>value.toString())
    _id:ObjectId;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Cycles'}) // chu ki
    @Type(()=>Cycles)
    cycles:Cycles;
    @Prop({type:Number})
    currentMoney:Number;
    @Prop({type:Date})
    startDate:Date; // ngay bat dau chu ki moi
    @Prop({type:Date})
    endDate:Date; // 1 thang sau start date
}
export const CyclesUpdateSchema=SchemaFactory.createForClass(CyclesUpdate);