import { ObjectId } from "mongoose";
import * as mongoose from 'mongoose';
export declare type CartDocument = Cart & Document;
export declare class Cart {
    _id: ObjectId;
    userId: ObjectId;
    option: number;
    startDate: Date;
    endDate: Date;
    deposits: number;
    totalProfit: number;
}
export declare const CartSchema: mongoose.Schema<mongoose.Document<Cart, any, any>, mongoose.Model<mongoose.Document<Cart, any, any>, any, any, any>, {}>;
