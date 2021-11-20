import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "src/decorators/getuser.decorators";
import { User } from "src/User/Schema/User.Schema";
import { IReponse } from "src/Utils/IReponse";
import { SavingsDepositDTO } from "./DTO/SavingsDeposit.dto";
import { SavingsDepositService } from "./SavingsDeposit.service";
import { SavingsDeposit } from "./Schema/SavingsDeposit.Schema";

@Controller('/savingsdeposit')
@UseGuards(AuthGuard())
export class SavingsDepositController{
    constructor(private savingsdepositservice:SavingsDepositService){}
    @Post('/save')
    async saveSavingdeposit(@Body() savingsdepositdto:SavingsDepositDTO,@GetUser() user:User):Promise<IReponse<SavingsDeposit>>{
        savingsdepositdto.userId=user._id;
        return this.savingsdepositservice.saveSavingsdeposit(savingsdepositdto,user)
    }
    @Get('/check/:id')
    async getTotalCycles(@Param('id') id):Promise<SavingsDeposit>{
        return this.savingsdepositservice.getTotalCycles(id);
    }
}