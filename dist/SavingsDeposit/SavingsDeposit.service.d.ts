import * as mongoose from 'mongoose';
import { CyclesUpdateService } from "src/CyclesUpdate/CyclesUpdate.service";
import { OptionService } from "src/Option/Option.service";
import { User } from "src/User/Schema/User.Schema";
import { UserService } from "src/User/User.service";
import { IReponse } from "src/Utils/IReponse";
import { SavingsDepositDTO } from "./DTO/SavingsDeposit.dto";
import { SavingsDeposit, SavingsDepositDocument } from "./Schema/SavingsDeposit.Schema";
export declare class SavingsDepositService {
    private savingsdepositmodel;
    private readonly connection;
    private userservice;
    private cyclesupdateservice;
    private optionservice;
    constructor(savingsdepositmodel: mongoose.Model<SavingsDepositDocument>, connection: mongoose.Connection, userservice: UserService, cyclesupdateservice: CyclesUpdateService, optionservice: OptionService);
    saveSavingsdeposit(savingsdeposit: SavingsDepositDTO, user: User): Promise<IReponse<SavingsDeposit>>;
    getTotalCycles(svdid: any): Promise<SavingsDeposit>;
    GetAllPassbookByUserId(user: User): Promise<any>;
    GetPassbookIsActive(user: User): Promise<any>;
    GetPassBookById(id: any, user: User): Promise<SavingsDeposit>;
}
