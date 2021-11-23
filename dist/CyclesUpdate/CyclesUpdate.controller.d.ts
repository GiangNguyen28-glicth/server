import { CyclesUpdateService } from "./CyclesUpdate.service";
import { CyclesUpdateDTO } from "./DTO/CyclesUpdate.dto";
import { CyclesUpdate } from "./Schema/CyclesUpdate.schema";
export declare class CyclesUpdateController {
    private cyclesupdateservice;
    constructor(cyclesupdateservice: CyclesUpdateService);
    saveCyclesUpdate(cyclesupdatedto: CyclesUpdateDTO): Promise<CyclesUpdate>;
}
