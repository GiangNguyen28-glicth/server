import * as mongoose from 'mongoose';
import { OptionService } from 'src/Option/Option.service';
import { User } from 'src/User/Schema/User.Schema';
import { UserService } from 'src/User/User.service';
import { IReponse } from 'src/Utils/IReponse';
import { PassBookDTO } from './DTO/PassBook.dto';
import { PassBook, PassBookDocument } from './Schema/PassBook.Schema';
import { Cache } from 'cache-manager';
import { CommonService } from 'src/Utils/common.service';
export declare class PassBookService {
    private passbookmodel;
    private cacheManager;
    private readonly connection;
    private userservice;
    private optionservice;
    private commonservice;
    constructor(passbookmodel: mongoose.Model<PassBookDocument>, cacheManager: Cache, connection: mongoose.Connection, userservice: UserService, optionservice: OptionService, commonservice: CommonService);
    saveSavingsdeposit(passbookdto: PassBookDTO, user: User): Promise<IReponse<PassBook>>;
    getTotalCycles(passbookid: any, user: User): Promise<any>;
    GetAllPassbookByUserId(user: User): Promise<any>;
    GetPassbookIsNotActive(user: User): Promise<PassBook[]>;
    withdrawMoneyPassbook(passbookid: any, user: User): Promise<PassBook>;
    getAllPassbook(): Promise<PassBook[]>;
}
