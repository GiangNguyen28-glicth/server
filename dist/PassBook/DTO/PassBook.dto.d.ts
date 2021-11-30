import { ObjectId } from "mongoose";
export declare class PassBookDTO {
    deposits: number;
    option: number;
    userId: ObjectId;
    optionId: ObjectId;
    createAt: Date;
}
