import { ObjectId } from "mongoose";
export declare type CyclesDocument = Cycles & Document;
export declare class Cycles {
    _id: ObjectId;
    Year?: Date;
    Interestrate: [Object];
}
export declare const CyclesSchema: import("mongoose").Schema<import("mongoose").Document<Cycles, any, any>, import("mongoose").Model<import("mongoose").Document<Cycles, any, any>, any, any, any>, {}>;
