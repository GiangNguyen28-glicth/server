import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Transform, Type } from "class-transformer";
import { Date, ObjectId } from "mongoose";
import * as mongoose from "mongoose";
import { User } from "src/User/Schema/User.Schema";
import { CyclesUpdate } from "src/CyclesUpdate/Schema/CyclesUpdate.schema";
export type PassBookDocument=PassBook & Document;
@Schema()
export class PassBook{
    @Transform(({value})=>value.toString())
    _id:ObjectId;

    @Prop()
    deposits:number; // tien gui

    @Prop()
    option:number;

    @Prop({type:Date,default:Date.now})
    createAt:Date;

    @Prop({default:false})
    status:boolean;

    @Prop({type:mongoose.Schema.Types.ObjectId,ref:'User',required:true})
    @Type(()=>User)
    userId:ObjectId;

    @Prop()
    @Type(()=>CyclesUpdate)
    cyclesupdate:[CyclesUpdate];
}
export const PassBookSchema=SchemaFactory.createForClass(PassBook);