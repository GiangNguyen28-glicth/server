import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CyclesUpdateDTO } from "./DTO/CyclesUpdate.dto";
import { CyclesUpdate, CyclesUpdateDocument } from "./Schema/CyclesUpdate.schema";

@Injectable()
export class CyclesUpdateService{
    constructor(@InjectModel(CyclesUpdate.name)private cyclesupdatemodel:Model<CyclesUpdateDocument>){}
    
    async saveCyclesUpdate(input:CyclesUpdateDTO):Promise<CyclesUpdate>{
        const result=await this.cyclesupdatemodel.create(input);
        result.save();
        return result;
    }
}