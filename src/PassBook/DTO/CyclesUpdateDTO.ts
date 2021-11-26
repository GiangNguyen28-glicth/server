import { ObjectId } from "mongoose";
export class CyclesUpdateDTO{
    currentMoney:number;
    startDate:Date;
    endDate:Date;
    value:number;
    passbookId:ObjectId;
}