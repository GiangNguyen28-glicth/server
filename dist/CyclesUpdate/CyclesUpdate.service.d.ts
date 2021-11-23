import { Model } from "mongoose";
import { CyclesUpdateDTO } from "./DTO/CyclesUpdate.dto";
import { CyclesUpdate, CyclesUpdateDocument } from "./Schema/CyclesUpdate.schema";
export declare class CyclesUpdateService {
    private cyclesupdatemodel;
    constructor(cyclesupdatemodel: Model<CyclesUpdateDocument>);
    saveCyclesUpdate(input: CyclesUpdateDTO): Promise<CyclesUpdate>;
}
