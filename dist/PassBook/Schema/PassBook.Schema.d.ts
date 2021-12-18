import { Date, ObjectId } from 'mongoose';
import * as mongoose from 'mongoose';
export declare type PassBookDocument = PassBook & Document;
export declare class PassBook {
    _id: ObjectId;
    deposits: number;
    option: number;
    createAt: Date;
    endAt: Date;
    status: boolean;
    userId: ObjectId;
    optionId: ObjectId;
    cyclesupdate: Object;
}
export declare const PassBookSchema: mongoose.Schema<mongoose.Document<PassBook, any, any>, mongoose.Model<mongoose.Document<PassBook, any, any>, any, any, any>, {}>;
