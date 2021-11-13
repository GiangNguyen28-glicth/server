import { IsObject, IsOptional, Max, Min } from "class-validator";
import { ObjectId } from "mongoose";
export class SavingsDepositDTO{
    @Min(10)
    @Max(50)
    deposits:Number;
    option:Number;
    userId:ObjectId;
}