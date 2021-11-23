import * as mongoose from 'mongoose';
import { CyclesUpdateService } from "src/CyclesUpdate/CyclesUpdate.service";
import { OptionService } from "src/Option/Option.service";
import { User } from "src/User/Schema/User.Schema";
import { UserService } from "src/User/User.service";
import { ClearCache } from "src/Utils/clear.cache";
import { IReponse } from "src/Utils/IReponse";
import { PassBookDTO } from "./DTO/PassBook.dto";
import { PassBook, PassBookDocument } from "./Schema/PassBook.Schema";
export declare class PassBookService {
    private passbookmodel;
    private readonly connection;
    private userservice;
    private cyclesupdateservice;
    private optionservice;
    private cacheservice;
    constructor(passbookmodel: mongoose.Model<PassBookDocument>, connection: mongoose.Connection, userservice: UserService, cyclesupdateservice: CyclesUpdateService, optionservice: OptionService, cacheservice: ClearCache);
    saveSavingsdeposit(passbookdto: PassBookDTO, user: User): Promise<IReponse<PassBook>>;
    getTotalCycles(svdid: any): Promise<any>;
    GetAllPassbookByUserId(user: User): Promise<any>;
    GetPassbookIsActive(user: User): Promise<any>;
    GetPassBookById(id: any, user: User): Promise<PassBook>;
}
