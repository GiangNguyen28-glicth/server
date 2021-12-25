import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController{
    @Get()
    async checkServer(){
        return "Deploy Success Version 10";
    }
}