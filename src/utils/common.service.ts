import axios from 'axios';
import { Injectable } from "@nestjs/common";
@Injectable()
export class CommonService{
   
    constructor(){}
    async convertMoney():Promise<any>{
        const resp=await axios.get("http://api.exchangeratesapi.io/v1/latest?access_key="+process.env.access_key)
        const usd=resp.data.rates.USD;
        const vnd=resp.data.rates.VND;
        return{vnd,usd}
    }
    convertDatetime(date:Date):Date{
        var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);
        var offset = date.getTimezoneOffset() / 60;
        var hours = date.getHours();
        newDate.setHours(hours - offset);
        return newDate;
    }
}