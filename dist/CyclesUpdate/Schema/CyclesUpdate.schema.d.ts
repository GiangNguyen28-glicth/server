import { ObjectId } from "mongoose";
import * as mongoose from 'mongoose';
export declare type CyclesUpdateDocument = CyclesUpdate & Document;
export declare class CyclesUpdate {
    _id: ObjectId;
    value: number;
    currentMoney: Number;
    startDate: Date;
    endDate: Date;
    passbookId: ObjectId;
}
export declare const CyclesUpdateSchema: mongoose.Schema<mongoose.Document<CyclesUpdate, any, any>, mongoose.Model<mongoose.Document<CyclesUpdate, any, any>, any, any, any>, {}>;
