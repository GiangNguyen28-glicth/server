import { Date, ObjectId } from "mongoose";
import * as mongoose from "mongoose";
import { CyclesUpdate } from "src/CyclesUpdate/Schema/CyclesUpdate.schema";
export declare type PassBookDocument = PassBook & Document;
export declare class PassBook {
    _id: ObjectId;
    deposits: number;
    option: number;
    createAt: Date;
    status: boolean;
    userId: ObjectId;
    cyclesupdate: [CyclesUpdate];
}
export declare const PassBookSchema: mongoose.Schema<mongoose.Document<PassBook, any, any>, mongoose.Model<mongoose.Document<PassBook, any, any>, any, any, any>, {}>;
