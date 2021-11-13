import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Transform } from "class-transformer";
import { ObjectId } from "mongoose";
export type CyclesDocument=Cycles & Document;
@Schema()
export class Cycles{
    @Transform(({value})=>value.toString())
    _id:ObjectId;
    @Prop({type:Date,default:Date.now})
    Year?:Date;
    @Prop({type:Object})
    Interestrate:[Object];
}
export const CyclesSchema=SchemaFactory.createForClass(Cycles);