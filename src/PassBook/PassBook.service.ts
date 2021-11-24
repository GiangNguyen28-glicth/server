import { CACHE_MANAGER, forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import * as mongoose from 'mongoose';
import { CyclesUpdateService } from "src/CyclesUpdate/CyclesUpdate.service";
import { CyclesUpdateDTO } from "src/CyclesUpdate/DTO/CyclesUpdate.dto";
import { CyclesUpdate } from "src/CyclesUpdate/Schema/CyclesUpdate.schema";
import { OptionService } from "src/Option/Option.service";
import { Action } from "src/User/DTO/HistoryAction.obj";
import { User } from "src/User/Schema/User.Schema";
import { UserService } from "src/User/User.service";
import { ClearCache } from "src/Utils/clear.cache";
import { IReponse } from "src/Utils/IReponse";
import { CacheKeyPassbook } from "./DTO/cache.key.dto";
import { PassBookDTO } from "./DTO/PassBook.dto";
import { PassBook, PassBookDocument } from "./Schema/PassBook.Schema";
import { Cache } from 'cache-manager';
@Injectable()
export class PassBookService{

    constructor(@InjectModel(PassBook.name)
    private passbookmodel:mongoose.Model<PassBookDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectConnection() private readonly connection: mongoose.Connection,
    @Inject(forwardRef(()=>UserService))
    private userservice:UserService,
    private cyclesupdateservice:CyclesUpdateService,
    private optionservice:OptionService,
    ){}

    async saveSavingsdeposit(passbookdto:PassBookDTO,user:User):Promise<IReponse<PassBook>>{
        const session = await this.connection.startSession();
        session.startTransaction();
        try{
            // let cyclesupdatedto : CyclesUpdateDTO=new CyclesUpdateDTO();
            // cyclesupdatedto.currentMoney=savingsdeposit.deposits;            
            const svdp=await this.passbookmodel.create(passbookdto);
            // this.cacheservice.clearCache(CacheKeyPassbook.GET_PASSBOOK_CACHE_KEY_TOTAL_PASSBOOK);
            // cyclesupdatedto.svdId=svdp._id;
            // const cycles=await this.cyclesupdateservice.saveCyclesUpdate(cyclesupdatedto);
            // svdp.cyclesupdate.push(cycles);
            svdp.save();
            await this.userservice.updateSvd(svdp,user);
            return{ code:200,success:true,message:"Succes",
            }
        }
        catch(err){
            session.abortTransaction();
            return{code:500,success:false,message:err.message
            }
        }
    }

    async getTotalCycles(passbookid,user:User):Promise<any>{
        CacheKeyPassbook.GET_PASSBOOK_CACHE_KEY_TOTAL_PROFIT=passbookid.toString()+"PROFIT";
        const checkCache=await this.cacheManager.get(CacheKeyPassbook.GET_PASSBOOK_CACHE_KEY_TOTAL_PROFIT);
        if(checkCache==undefined){
            CacheKeyPassbook.GET_PASSBOOK_CACHE_KEY_TOTAL_PROFIT=passbookid.toString()+"PROFIT";
        }
        else{
            return checkCache;
        }
        var endDate=new Date();
        let value;
        const svd=await this.passbookmodel.findOne({_id:passbookid,userId:user._id});
        if(!svd){return {code:500,success:false,message:"Cant find Passbook in DB"}}
        const startDate=new Date(`${svd.createAt}`);
        let result=[];
        const startcycle=new CyclesUpdateDTO();
        while(startDate<=endDate){
            const startcycle=new CyclesUpdateDTO();
            value=await this.optionservice.GetValueOption(startDate,svd.option);
            startcycle.startDate=new Date(startDate);
            startDate.setMonth(startDate.getMonth() + svd.option);
            startcycle.endDate=new Date(startDate);
            startcycle.value=value;
            result.push(startcycle);
        }
        let money=svd.deposits; //tien gui
        for(let i=0;i<result.length-1;i++){
            money=((money*(result[i].value/100))*svd.option/12)+money;
            result[i].currentMoney=money;
        }
        const diffDays = (date, otherDate) => Math.ceil(Math.abs(date - otherDate) / (1000 * 60 * 60 * 24));
        const date=diffDays(endDate, result[result.length-1].startDate);
        money=money+money*0.0001*(date-1)/360;
        await this.cacheManager.set(CacheKeyPassbook.GET_PASSBOOK_CACHE_KEY_TOTAL_PROFIT,{data:result,money:money},{ ttl: 1000 });
        return {
            data:result,
            money:money
        };
    }

    async GetAllPassbookByUserId(user:User):Promise<any>{
        const passbook=await this.passbookmodel.find({userId:user._id});
        if(CacheKeyPassbook.GET_PASSBOOK_CACHE_KEY_TOTAL_PASSBOOK==""){
            CacheKeyPassbook.GET_PASSBOOK_CACHE_KEY_TOTAL_PASSBOOK=user._id.toString()+"GETALLPASSBOOK";
        }
        return passbook;
    }

    async GetPassbookIsActive(user:User):Promise<PassBook[]>{
        if(CacheKeyPassbook.GET_PASSBOOK_CACHE_KEY_IS_ACTIVE==""){
            CacheKeyPassbook.GET_PASSBOOK_CACHE_KEY_IS_ACTIVE=user._id.toString()+"GET_PASSBOOK_CACHE_KEY_IS_ACTIVE";
        }
        const passbook=await this.passbookmodel.find({userId:user._id,status:false});
        return passbook;
    }

    async GetPassBookById(passbookid,user:User):Promise<PassBook>{
        return this.passbookmodel.findOne({userId:user._id,_id:passbookid})
    }

    async withdrawMoneyPassbook(passbookid,user:User):Promise<PassBook>{
        const passbook=await this.passbookmodel.findOne({_id:passbookid,userId:user._id}); 
        if(!passbook){console.log("Passbook not found"); return null};
        if(passbook.status){console.log("Passbook is Active");return null};
        const {data,money}=await this.getTotalCycles(passbookid,user);
        passbook.update({status:true});
        passbook.save();
        await this.userservice.updateMoney(Action.WITHDRAWAL,money,user);
        return null;
    }
}   