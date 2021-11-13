import { IsObject, IsOptional, Max, Min } from "class-validator";
import { CyclesUpdate } from "src/CyclesUpdate/Schema/CyclesUpdate.schema";

export class SavingsDepositDTO{
    deposits:Number;
    cyclesupdate:Object;
}