import { Min } from "class-validator";

export class CartDTO{
    option:number;
    @Min(100)
    deposits:number;
    startDate:Date;
    suggest:number;
    depositinpassbook:number;
    profitinpassbook:number;
}