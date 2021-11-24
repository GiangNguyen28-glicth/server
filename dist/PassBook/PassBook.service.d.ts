import * as mongoose from 'mongoose';
import { CyclesUpdateService } from "src/CyclesUpdate/CyclesUpdate.service";
import { OptionService } from "src/Option/Option.service";
import { User } from "src/User/Schema/User.Schema";
import { UserService } from "src/User/User.service";
import { IReponse } from "src/Utils/IReponse";
import { PassBookDTO } from "./DTO/PassBook.dto";
import { PassBook, PassBookDocument } from "./Schema/PassBook.Schema";
import { Cache } from 'cache-manager';
export declare class PassBookService {
    private passbookmodel;
    private cacheManager;
    private readonly connection;
    private userservice;
    private cyclesupdateservice;
    private optionservice;
    constructor(passbookmodel: mongoose.Model<PassBookDocument>, cacheManager: Cache, connection: mongoose.Connection, userservice: UserService, cyclesupdateservice: CyclesUpdateService, optionservice: OptionService);
    saveSavingsdeposit(passbookdto: PassBookDTO, user: User): Promise<IReponse<PassBook>>;
    getTotalCycles(passbookid: any, user: User): Promise<any>;
    GetAllPassbookByUserId(user: User): Promise<any>;
    GetPassbookIsActive(user: User): Promise<PassBook[]>;
    GetPassBookById(passbookid: any, user: User): Promise<PassBook>;
    withdrawMoneyPassbook(passbookid: any, user: User): Promise<PassBook>;
}
