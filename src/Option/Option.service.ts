import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { newOptionDTO } from "./DTO/newOption.dto";
import { OptionDTO } from "./DTO/Option.dto";
import { OptionObj } from "./DTO/OptionObj.dto";
import { Cache } from 'cache-manager';
import { OptionDocument,Option } from "./Schema/Option.chema";
@Injectable()
export class OptionService{
    constructor(@InjectModel(Option.name)
    private optionmodel:Model<OptionDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache){}
    async saveoption(option:OptionDTO):Promise<Option>{
        const result=await this.optionmodel.create(option);
        result.save();
        return result;
    }

    async findAllOption():Promise<Option[]>{
        return await this.optionmodel.find();
    }

    async updatenewOption(id,newoptiondto:newOptionDTO):Promise<Option>{
        const optionOld=await this.optionmodel.findOne({_id:id});
        if(!optionOld || optionOld.value==newoptiondto.value){
            return;
        }
        let obj:OptionObj=new OptionObj();
        let date=new Date();
        obj.createAt=date;
        obj.value=optionOld.value;
        optionOld.history.push(obj);
        optionOld.value=newoptiondto.value;
        optionOld.createAt=new Date();
        optionOld.update();
        optionOld.save();
        return optionOld;
    }

    async GetValueOption(date:Date,option:number):Promise<number>{
        let temp2;
        const result=await this.optionmodel.findOne({option:option});
        if(!result.history.length ||result.history[result.history.length-1].createAt<date){
            return result.value;
        }
        for(let i=0;i<result.history.length-1;i++){
            if(result.history[i].createAt<date && result.history[i+1].createAt>date){
                return result.history[i].value;
            }
        }
    }

    async GetValueByYear(Year:number):Promise<any>{
        const date=new Date();
        let arr=[];
        const checkCache=await this.cacheManager.get(Year.toString());
        if(checkCache!=undefined){
            return checkCache;
        }
        const currentvalue=await this.optionmodel.find();
        for(var i in currentvalue){
            if(currentvalue[i].createAt.getFullYear()==Year){
                arr.push(currentvalue[i].value)
            }
            else{
               for(var j=0;j<currentvalue[i].history.length;j++){
                    if(currentvalue[i].history[j].createAt.getFullYear()==Year+1){
                        if(currentvalue[i].history[j-1]!=null&&currentvalue[i].history[j-1].createAt.getFullYear()==Year){
                            arr.push(currentvalue[i].history[j-1].value);
                            break;
                        }
                    }
                   if(j==currentvalue[i].history.length-1){
                       if( currentvalue[i].history[j].createAt.getFullYear()==Year){
                        arr.push(currentvalue[i].history[j].value);
                       }
                   }   
               }
            }
        }
        await this.cacheManager.set(Year.toString,arr,{ ttl: 1000 });
        return arr;
    }
}