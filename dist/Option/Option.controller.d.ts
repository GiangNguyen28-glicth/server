import { newOptionDTO } from "./DTO/newOption.dto";
import { OptionDTO } from "./DTO/Option.dto";
import { OptionService } from "./Option.service";
import { Option } from "./Schema/Option.chema";
export declare class OptionController {
    private optionService;
    constructor(optionService: OptionService);
    saveOption(optiondto: OptionDTO): Promise<Option>;
    findAllOption(): Promise<Option[]>;
    updateOption(id: any, newoptiondto: newOptionDTO): Promise<Option>;
    GetValueOption(option: newOptionDTO): Promise<number>;
    GetCurrentOptionValue(Year: number): Promise<any>;
}
