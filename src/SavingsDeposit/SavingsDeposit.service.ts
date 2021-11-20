import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import * as mongoose from 'mongoose';
import { CyclesUpdateService } from "src/CyclesUpdate/CyclesUpdate.service";
import { CyclesUpdateDTO } from "src/CyclesUpdate/DTO/CyclesUpdate.dto";
import { CyclesUpdate } from "src/CyclesUpdate/Schema/CyclesUpdate.schema";
import { OptionService } from "src/Option/Option.service";
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
    private optionservice:OptionService
    ){}

    async saveSavingsdeposit(savingsdeposit:SavingsDepositDTO,user:User):Promise<IReponse<SavingsDeposit>>{
        const session = await this.connection.startSession();
        session.startTransaction();
        try{
            // let cyclesupdatedto : CyclesUpdateDTO=new CyclesUpdateDTO();
            // cyclesupdatedto.currentMoney=savingsdeposit.deposits;            
            const svdp=await this.savingsdepositmodel.create(savingsdeposit);
            // cyclesupdatedto.svdId=svdp._id;
            // const cycles=await this.cyclesupdateservice.saveCyclesUpdate(cyclesupdatedto);
            // svdp.cyclesupdate.push(cycles);
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

    async getTotalCycles(svdid):Promise<SavingsDeposit>{
        var endDate=new Date();
        let value;
        let arr=[];
        const svd=await this.savingsdepositmodel.findOne({_id:svdid});
        const startDate=new Date(`${svd.createAt}`);
        let temp=[];
        while(startDate<=endDate){
            temp.push(new Date(startDate));
            startDate.setMonth(startDate.getMonth() + svd.option);
            console.log(startDate);
            value=await this.optionservice.GetValueOption(startDate,svd.option);
            console.log(value);
            arr.push(value);
        }
        console.log(arr);
        let money=svd.deposits; //tien gui
        for(let i=0;i<arr.length-1;i++){
            money=((money*(arr[i]/100))*svd.option/12)+money;
            console.log(money);
        }
        const diffDays = (date, otherDate) => Math.ceil(Math.abs(date - otherDate) / (1000 * 60 * 60 * 24));
        const date=diffDays(endDate, temp[temp.length-1]);
        console.log(date);
        money=money+money*0.0001*(date-1)/360;
        console.log("total:"+money)
        return null;
    }
}   