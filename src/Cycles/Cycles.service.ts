import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CyclesDTO } from "./DTO/Cycles.dto";
import { Cycles, CyclesDocument } from "./Schema/Cycles.chema";

@Injectable()
export class CyclesService{
    constructor(@InjectModel(Cycles.name)
    private cyclesmodel:Model<CyclesDocument>){}
    async saveCycles(cyclesdto:CyclesDTO):Promise<Cycles>{
        const result=await this.cyclesmodel.create(cyclesdto);
        result.save();
        return result;
    }
    async test(id):Promise<Cycles>{
        const result=await this.cyclesmodel.findOne({_id:id});
        console.log(result.Interestrate);
        const test2=result.Interestrate;
        let keys = Object.keys(test2)
        let values = keys.map(k => test2[k])
        console.log(values);
        return result;
    }
}