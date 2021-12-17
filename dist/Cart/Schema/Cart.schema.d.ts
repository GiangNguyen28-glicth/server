import { ObjectId } from "mongoose";
import * as mongoose from 'mongoose';
export declare type CartDocument = Cart & Document;
export declare class Cart {
    _id: ObjectId;
    userId: ObjectId;
    option: number;
    optionId: ObjectId;
    startDate: Date;
    endDate: Date;
    deposits: number;
    totalProfit: number;
    suggest: number;
    profit: number;
    depositinpassbook: number;
    profitinpassbook: number;
}
export declare const CartSchema: mongoose.Schema<mongoose.Document<Cart, any, any>, mongoose.Model<mongoose.Document<Cart, any, any>, any, any, any>, {}>;
