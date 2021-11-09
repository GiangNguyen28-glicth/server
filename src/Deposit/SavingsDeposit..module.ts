import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SavingsDepositService } from "./SavingsDeposit..service";
import { SavingsDepositController } from "./SavingsDeposit.controller";
import { SavingsDeposit, SavingsDepositSchema } from "./Schema/SavingsDeposit.Schema";

@Module({
    imports:[MongooseModule.forFeature([{name:SavingsDeposit.name,schema:SavingsDepositSchema}])],
    controllers:[SavingsDepositController],
    providers:[SavingsDepositService]
})
export class SavingsDepositModule{
    
}