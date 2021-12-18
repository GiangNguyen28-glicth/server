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
}