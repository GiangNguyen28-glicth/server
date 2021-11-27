import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController{
    @Get()
    async checkServer(){
        const res=await fetch("http://api.exchangeratesapi.io/v1/latest?access_key=f96f7a35f4213b735aeeeb8d084cff8f");
        const data= await res.json();
        console.log(data);
        return "Deploy Success Version 5";
    }
}