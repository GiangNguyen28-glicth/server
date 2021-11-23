import { ObjectId } from "mongoose";
import { OptionObj } from "../DTO/OptionObj.dto";
export declare type OptionDocument = Option & Document;
export declare class Option {
    _id: ObjectId;
    option: number;
    value: number;
    createAt: Date;
    history: [OptionObj];
}
export declare const OptionSchema: import("mongoose").Schema<import("mongoose").Document<Option, any, any>, import("mongoose").Model<import("mongoose").Document<Option, any, any>, any, any, any>, {}>;
