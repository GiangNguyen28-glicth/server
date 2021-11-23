import { User } from "src/User/Schema/User.Schema";
import { IReponse } from "src/Utils/IReponse";
import { PassBookDTO } from "./DTO/PassBook.dto";
import { PassBookService } from "./PassBook.service";
import { PassBook } from "./Schema/PassBook.Schema";
export declare class PassBookController {
    private passbookservice;
    constructor(passbookservice: PassBookService);
    saveSavingdeposit(passbookdto: PassBookDTO, user: User): Promise<IReponse<PassBook>>;
    getTotalCycles(id: any): Promise<any>;
    getPassbook(user: User): Promise<any>;
    getPassbookIsActive(user: User): Promise<any>;
    GetPassbookById(user: User, id: any): Promise<PassBook>;
}
