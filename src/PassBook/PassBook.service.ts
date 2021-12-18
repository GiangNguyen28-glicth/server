import { CACHE_MANAGER, forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import * as mongoose from 'mongoose';
import { OptionService } from "src/Option/Option.service";
import { Action } from "src/User/DTO/HistoryAction.obj";
import { User } from "src/User/Schema/User.Schema";
import { UserService } from "src/User/User.service";
import { IReponse } from "src/Utils/IReponse";
import { CacheKeyPassbook } from "./DTO/cache.key.dto";
import { PassBookDTO } from "./DTO/PassBook.dto";
import { PassBook, PassBookDocument } from "./Schema/PassBook.Schema";
import { Cache } from 'cache-manager';
import { CyclesUpdateDTO } from "./DTO/CyclesUpdateDTO";
import { CommonService } from "src/Utils/common.service";
@Injectable()
export class PassBookService{

    constructor(@InjectModel(PassBook.name)
    private passbookmodel:mongoose.Model<PassBookDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectConnection() private readonly connection: mongoose.Connection,
    @Inject(forwardRef(()=>UserService))
    private userservice:UserService,
    private optionservice:OptionService,
    private commonservice:CommonService
    ){}

    async saveSavingsdeposit(passbookdto:PassBookDTO,user:User):Promise<IReponse<PassBook>>{
        try{ 
           
            const svdp=await this.passbookmodel.create(passbookdto);
            svdp.save();
            await this.userservice.updateSvd(svdp,user);
            return{ code:200,success:true,message:"Succes",}
        }
        catch(err){
            return{code:500,success:false,message:err.message
            }
        }
    }

    async getTotalCycles(passbookid,user:User):Promise<any>{
        var endDate=new Date();
        let value;
        const svd=await this.passbookmodel.findOne({_id:passbookid,userId:user._id} );
        if(!svd){return {code:500,success:false,message:"Sổ tiết kiệm không hợp lệ"}}
        const startDate=new Date(`${svd.createAt}`);
        let result=[];
        if(startDate.getFullYear()==endDate.getFullYear()&&startDate.getMonth()==endDate.getMonth()
            &&startDate.getDate()==endDate.getDate()){
            const startcycle=new CyclesUpdateDTO();
            startcycle.startDate=startDate;
            startcycle.endDate=endDate;
            const nooption=await this.optionservice.GetValueOption(endDate,0);
            startcycle.value=nooption;
            result.push(startcycle);
            return {passbook:svd,cycles:result,songayle:0, //so ngay le
                money:svd.deposits
            };
        }
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
        const diffDays = (date, otherDate)  => Math.ceil(Math.abs(date - otherDate) / (1000 * 60 * 60 * 24));
        const date=diffDays(endDate, result[result.length-1].startDate);
        if(date-1>0){
            const nooption=await this.optionservice.GetValueOption(endDate,0);
            money=money+money*(nooption/100)*(date-1)/360;
            result[result.length-1].endDate=endDate;
            result[result.length-1].value=nooption;
        }
        else{result.pop()}
        return {passbook:svd,cycles:result,songayle:date-1, //so ngay le
            money:money
        };
    }

    async GetAllPassbookByUserId(user:User):Promise<any>{
        const passbook=await this.passbookmodel.find({userId:user._id});
        return passbook;
    }

    async GetPassbookIsNotActive(user:User):Promise<PassBook[]>{
        const passbook=await this.passbookmodel.find({userId:user._id,status:false});
        return passbook;
    }

    async withdrawMoneyPassbook(passbookid,user:User):Promise<any>{
        const passbook=await this.passbookmodel.findOne({_id:passbookid,userId:user._id}); 
        if(!passbook){console.log("Passbook not found"); return {success:false,message:"Không Tìm Thấy Sổ Tiết Kiệm"}};
        if(passbook.status){console.log("Passbook is Active");return {success:false,message:"Sổ tiết kiệm đã được rút"}};
        const data=await this.getTotalCycles(passbookid,user);
        passbook.cyclesupdate=data.cycles;
        passbook.status=true;
        passbook.save();
        await this.userservice.updateMoney(Action.WITHDRAWAL,data.money,user);
        return {passbook:passbook,songayle:data.songayle,money:data.money};
    }

    async getAllPassbook():Promise<PassBook[]>{
        return await this.passbookmodel.find().sort({_id:-1});
    }

    async getnewPassBook():Promise<any>{
        const newpassbook= await this.passbookmodel.find({status:false}).sort({_id:-1}).limit(10).lean();
        return{newpassbook:newpassbook}
    }
}   