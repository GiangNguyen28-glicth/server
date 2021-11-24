import { Controller } from "@nestjs/common";

@Controller()
export class AppController{
    checkServer(){
        return "Deploy Success";
    }
}