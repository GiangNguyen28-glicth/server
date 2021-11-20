import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Transform } from "class-transformer";
import { ObjectId } from "mongoose";
import { OptionObj } from "../DTO/OptionObj.dto";
export type OptionDocument=Option & Document;
@Schema()
export class Option{
    @Transform(({value})=>value.toString())
    _id:ObjectId;
    @Prop()
    option:number; // so thang
    @Prop()
    value:number; // %
    @Prop({type:Date,default:Date.now})
    createAt:Date;
    @Prop()
    history:[OptionObj];
}
export const OptionSchema=SchemaFactory.createForClass(Option);