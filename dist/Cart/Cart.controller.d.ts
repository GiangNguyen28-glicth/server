import { User } from "src/User/Schema/User.Schema";
import { CartService } from "./Cart.service";
import { CartDTO } from "./DTO/Cart.dto";
export declare class CartController {
    private cartservice;
    constructor(cartservice: CartService);
    addtoCart(cartdto: CartDTO, user: User): Promise<any>;
    dividePassbook(user: User, quantity: number): Promise<any>;
}
