import { Model } from 'mongoose';
import { MailService } from 'src/Mail/mail.service';
import { OptionService } from 'src/Option/Option.service';
import { PassBookService } from 'src/PassBook/PassBook.service';
import { User } from 'src/User/Schema/User.Schema';
import { UserService } from 'src/User/User.service';
import { CartDTO } from './DTO/Cart.dto';
import { CartDocument } from './Schema/Cart.schema';
export declare class CartService {
    private cartmodel;
    private passbookservice;
    private userservice;
    private mailservice;
    private optionservice;
    constructor(cartmodel: Model<CartDocument>, passbookservice: PassBookService, userservice: UserService, mailservice: MailService, optionservice: OptionService);
    addtoCart(cartdto: CartDTO, user: User): Promise<any>;
    updateCart(quantity: number, user: User): Promise<any>;
    checkoutPassbook(user: User): Promise<any>;
}
