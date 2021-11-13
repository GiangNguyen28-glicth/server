import { ObjectId } from "mongoose";
export class CyclesUpdateDTO{
    cycles?:Object;
    currentMoney:Number;
    svdId:ObjectId;
}