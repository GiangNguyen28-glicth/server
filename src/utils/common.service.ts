import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { map, Observable } from "rxjs";

@Injectable()
export class CommonService{
    constructor( private httpService:HttpService){}
    async findAll():Promise<Observable<any>>{
        const resp=await this.httpService.get("http://api.exchangeratesapi.io/v1/latest?access_key="+process.env.access_key)
        .pipe(map(axiosResponse =>{
          this.continueApp(axiosResponse.data.rates.USD,axiosResponse.data.rates.VND)
          return axiosResponse.data.rates}));
        
        return resp;
    }

    async continueApp(obj1:number,obj2:number):Promise<void>{    
        console.log(obj1);
        console.log(obj2);
        // const currency=await this.currencymodel.create({USD:obj1,VND:obj2});
        // currency.save();
    }

    convertDatetime(date:Date):Date{
        var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);
        var offset = date.getTimezoneOffset() / 60;
        var hours = date.getHours();
        newDate.setHours(hours - offset);
        return newDate;
    }
}