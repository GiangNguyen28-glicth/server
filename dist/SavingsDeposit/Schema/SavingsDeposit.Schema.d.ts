import { Date, ObjectId } from "mongoose";
import * as mongoose from "mongoose";
import { CyclesUpdate } from "src/CyclesUpdate/Schema/CyclesUpdate.schema";
export declare type SavingsDepositDocument = SavingsDeposit & Document;
export declare class SavingsDeposit {
    _id: ObjectId;
    deposits: number;
    option: number;
    createAt: Date;
    status: boolean;
    userId: ObjectId;
    cyclesupdate: [CyclesUpdate];
}
export declare const SavingsDepositSchema: mongoose.Schema<mongoose.Document<SavingsDeposit, any, any>, mongoose.Model<mongoose.Document<SavingsDeposit, any, any>, any, any, any>, {}>;
