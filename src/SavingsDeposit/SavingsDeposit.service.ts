import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import * as mongoose from 'mongoose';
import { CyclesUpdateService } from "src/CyclesUpdate/CyclesUpdate.service";
import { CyclesUpdate } from "src/CyclesUpdate/Schema/CyclesUpdate.schema";
import { IReponse } from "src/Utils/IReponse";
import { SavingsDepositDTO } from "./DTO/SavingsDeposit.dto";
import { SavingsDeposit, SavingsDepositDocument } from "./Schema/SavingsDeposit.Schema";

@Injectable()
export class SavingsDepositService{

    constructor(@InjectModel(SavingsDeposit.name)
    private savingsdepositmodel:mongoose.Model<SavingsDepositDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
    private cyclesupdateservice:CyclesUpdateService){}

    async saveSavingsdeposit(savingsdeposit:SavingsDepositDTO):Promise<IReponse<SavingsDeposit>>{
        const session = await this.connection.startSession();
        session.startTransaction();
        try{
            const {  deposits,cyclesupdate}=savingsdeposit;
            const cycup=await this.cyclesupdateservice.saveCyclesUpdate(cyclesupdate);
            const svdp=await this.savingsdepositmodel.create(savingsdeposit);
            svdp.save();
            return{
                code:200,
                success:true,
                message:"Succes",
            }
        }
        catch(err){
            session.abortTransaction();
            return{
                code:500,
                success:false,
                message:"Failed"
            }
        }
        
    }
}   