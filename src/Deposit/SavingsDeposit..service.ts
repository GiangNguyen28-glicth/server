import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SavingsDeposit, SavingsDepositDocument } from "./Schema/SavingsDeposit.Schema";

@Injectable()
export class SavingsDepositService{
    constructor(@InjectModel(SavingsDeposit.name)
    private savingsdepositmodel:Model<SavingsDepositDocument>){}
}