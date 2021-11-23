import { User } from "src/User/Schema/User.Schema";
import { IReponse } from "src/Utils/IReponse";
import { SavingsDepositDTO } from "./DTO/SavingsDeposit.dto";
import { SavingsDepositService } from "./SavingsDeposit.service";
import { SavingsDeposit } from "./Schema/SavingsDeposit.Schema";
export declare class SavingsDepositController {
    private savingsdepositservice;
    constructor(savingsdepositservice: SavingsDepositService);
    saveSavingdeposit(savingsdepositdto: SavingsDepositDTO, user: User): Promise<IReponse<SavingsDeposit>>;
    getTotalCycles(id: any): Promise<SavingsDeposit>;
    getPassbook(user: User): Promise<any>;
    getPassbookIsActive(user: User): Promise<any>;
    GetPassbookById(user: User, id: any): Promise<SavingsDeposit>;
}
