import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import * as mongoose from 'mongoose';
import { CyclesUpdateService } from "src/CyclesUpdate/CyclesUpdate.service";
import { CyclesUpdateDTO } from "src/CyclesUpdate/DTO/CyclesUpdate.dto";
import { CyclesUpdate } from "src/CyclesUpdate/Schema/CyclesUpdate.schema";
import { User } from "src/User/Schema/User.Schema";
import { UserService } from "src/User/User.service";
import { IReponse } from "src/Utils/IReponse";
import { SavingsDepositDTO } from "./DTO/SavingsDeposit.dto";
import { SavingsDeposit, SavingsDepositDocument } from "./Schema/SavingsDeposit.Schema";

@Injectable()
export class SavingsDepositService{

    constructor(@InjectModel(SavingsDeposit.name)
    private savingsdepositmodel:mongoose.Model<SavingsDepositDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
    @Inject(forwardRef(()=>UserService))
    private userservice:UserService,
    private cyclesupdateservice:CyclesUpdateService,
    ){}

    async saveSavingsdeposit(savingsdeposit:SavingsDepositDTO,user:User):Promise<IReponse<SavingsDeposit>>{
        const session = await this.connection.startSession();
        session.startTransaction();
        try{
            let cyclesupdatedto : CyclesUpdateDTO=new CyclesUpdateDTO();
            cyclesupdatedto.cycles={"Month1":savingsdeposit.option};
            cyclesupdatedto.currentMoney=savingsdeposit.deposits;            
            const svdp=await this.savingsdepositmodel.create(savingsdeposit);
            cyclesupdatedto.svdId=svdp._id;
            const cycles=await this.cyclesupdateservice.saveCyclesUpdate(cyclesupdatedto);
            svdp.cyclesupdate.push(cycles);
            svdp.save();
            await this.userservice.updateSvd(svdp,user);
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
                message:err.message
            }
        }
        
    }
}   