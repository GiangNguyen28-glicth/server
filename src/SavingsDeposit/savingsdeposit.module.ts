import { Module } from "@nestjs/common";
import { SavingsDepositService } from "./SavingsDeposit.service";
import { SavingsDepositController } from "./SavingsDeposit.controller";
import { SavingsDeposit, SavingsDepositSchema } from "./Schema/SavingsDeposit.Schema";
import { MongooseModule } from "@nestjs/mongoose";
import { CyclesUpdateModule } from "src/CyclesUpdate/CyclesUpdate.module";

@Module({
    imports:[MongooseModule.forFeature([{name:SavingsDeposit.name,schema:SavingsDepositSchema}]),CyclesUpdateModule],
    controllers:[SavingsDepositController],
    providers:[SavingsDepositService]
})
export class SavingsDepositModule{

}