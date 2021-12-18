import { User } from "src/User/Schema/User.Schema";
import { IReponse } from "src/Utils/IReponse";
import { PassBookDTO } from "./DTO/PassBook.dto";
import { PassBookService } from "./PassBook.service";
import { PassBook } from "./Schema/PassBook.Schema";
export declare class PassBookController {
    private passbookservice;
    constructor(passbookservice: PassBookService);
    saveSavingdeposit(passbookdto: PassBookDTO, user: User): Promise<IReponse<PassBook>>;
    getTotalCycles(passbookid: any, user: User): Promise<any>;
    getPassbook(user: User): Promise<any>;
    getPassbookIsNotActive(user: User): Promise<any>;
    withdrawMoneyPassbook(user: User, passbookid: any): Promise<PassBook>;
    getAllPassbook(): Promise<PassBook[]>;
    getnewpassbook(): Promise<any>;
    getpassbookuser(userid: any): Promise<any>;
    checkInformationPassbook(passbookid: any, user: User): Promise<any>;
}
