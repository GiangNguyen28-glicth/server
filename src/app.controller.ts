import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController{
    @Get()
    checkServer(){
        return "Deploy Success Version ";
    }
}