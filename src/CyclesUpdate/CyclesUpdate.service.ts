import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IReponse } from "src/Utils/IReponse";
import { CyclesUpdate, CyclesUpdateDocument } from "./Schema/CyclesUpdate.schema";

@Injectable()
export class CyclesUpdateService{
    constructor(@InjectModel(CyclesUpdate.name)private cyclesupdatemodel:Model<CyclesUpdateDocument>){}
    
    async saveCyclesUpdate(input:any):Promise<IReponse<CyclesUpdate>>{
        const result=await this.cyclesupdatemodel.create(input);
        result.save();
        return{
            code:200,
            success:true,
            message:"No"
        }
    }
}