import { CyclesService } from "./Cycles.service";
import { CyclesDTO } from "./DTO/Cycles.dto";
import { Cycles } from "./Schema/Cycles.chema";
export declare class CyclesController {
    private cyclesService;
    constructor(cyclesService: CyclesService);
    saveCycles(cyclesdto: CyclesDTO): Promise<Cycles>;
    findAll(id: any): Promise<Cycles>;
}
