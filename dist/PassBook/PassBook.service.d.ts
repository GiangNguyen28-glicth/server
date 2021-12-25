import * as mongoose from 'mongoose';
import { OptionService } from 'src/Option/Option.service';
import { User } from 'src/User/Schema/User.Schema';
import { UserService } from 'src/User/User.service';
import { IReponse } from 'src/Utils/IReponse';
import { PassBookDTO } from './DTO/PassBook.dto';
import { PassBook, PassBookDocument } from './Schema/PassBook.Schema';
import { MailService } from 'src/Mail/mail.service';
export declare class PassBookService {
    private passbookmodel;
    private userservice;
    private optionservice;
    private mailservice;
    constructor(passbookmodel: mongoose.Model<PassBookDocument>, userservice: UserService, optionservice: OptionService, mailservice: MailService);
    saveSavingsdeposit(passbookdto: PassBookDTO, user: User): Promise<IReponse<PassBook>>;
    getTotalCycles(passbookid: any, user: User): Promise<any>;
    GetAllPassbookByUserId(user: User): Promise<any>;
    GetPassbookIsNotActive(user: User): Promise<PassBook[]>;
    withdrawMoneyPassbook(passbookid: any, user: User): Promise<any>;
    getAllPassbook(): Promise<PassBook[]>;
    getnewPassBook(): Promise<any>;
    getpassbookbyUser(userid: any): Promise<any>;
    getInformationPassbook(passbookid: any, user: any): Promise<any>;
}
