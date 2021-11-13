import { Body, Controller, Post } from "@nestjs/common";
import { IReponse } from "src/Utils/IReponse";
import { CyclesUpdateService } from "./CyclesUpdate.service";
import { CyclesUpdateDTO } from "./DTO/CyclesUpdate.dto";
import { CyclesUpdate } from "./Schema/CyclesUpdate.schema";

@Controller('/cyclesupdate')
export class CyclesUpdateController{
    constructor(private cyclesupdateservice:CyclesUpdateService){}
    @Post('/save')
    async saveCyclesUpdate(@Body() cyclesupdatedto:CyclesUpdateDTO):Promise<CyclesUpdate>{
        return this.cyclesupdateservice.saveCyclesUpdate(cyclesupdatedto);
    }
}