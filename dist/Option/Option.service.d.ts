import { Model } from "mongoose";
import { newOptionDTO } from "./DTO/newOption.dto";
import { OptionDTO } from "./DTO/Option.dto";
import { OptionDocument, Option } from "./Schema/Option.chema";
export declare class OptionService {
    private optionmodel;
    constructor(optionmodel: Model<OptionDocument>);
    saveoption(option: OptionDTO): Promise<Option>;
    findAllOption(): Promise<Option[]>;
    updatenewOption(id: any, newoptiondto: newOptionDTO): Promise<Option>;
    GetValueOption(date: Date, option: number): Promise<number>;
    GetValueByYear(Year: number): Promise<any>;
    findOption(option: number): Promise<any>;
    getCurrentValueOption(): Promise<Option[]>;
}
