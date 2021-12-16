import { Model } from "mongoose";
import { newOptionDTO } from "./DTO/newOption.dto";
import { OptionDTO } from "./DTO/Option.dto";
import { Cache } from 'cache-manager';
import { OptionDocument, Option } from "./Schema/Option.chema";
import { CommonService } from "src/Utils/common.service";
export declare class OptionService {
    private optionmodel;
    private commonservice;
    private cacheManager;
    constructor(optionmodel: Model<OptionDocument>, commonservice: CommonService, cacheManager: Cache);
    saveoption(option: OptionDTO): Promise<Option>;
    findAllOption(): Promise<Option[]>;
    updatenewOption(id: any, newoptiondto: newOptionDTO): Promise<Option>;
    GetValueOption(date: Date, option: number): Promise<number>;
    GetValueByYear(Year: number): Promise<any>;
    findOption(option: number): Promise<any>;
}
