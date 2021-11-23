import { Model } from "mongoose";
import { CyclesDTO } from "./DTO/Cycles.dto";
import { Cycles, CyclesDocument } from "./Schema/Cycles.chema";
export declare class CyclesService {
    private cyclesmodel;
    constructor(cyclesmodel: Model<CyclesDocument>);
    saveCycles(cyclesdto: CyclesDTO): Promise<Cycles>;
    test(id: any): Promise<Cycles>;
}
