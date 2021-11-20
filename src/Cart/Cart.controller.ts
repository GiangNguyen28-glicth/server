import { Body, Controller, Param, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "src/decorators/getuser.decorators";
import { User } from "src/User/Schema/User.Schema";
import { IReponse } from "src/Utils/IReponse";
import { CartService } from "./Cart.service";
import { CartDTO } from "./DTO/Cart.dto";
import { Cart } from "./Schema/Cart.schema";

@Controller('/cart')
export class CartController{
    constructor(private cartservice:CartService){}
    @Post('/addtocart')
    @UseGuards(AuthGuard())
    async addtoCart(@Body() cartdto:CartDTO,@GetUser() user:User):Promise<IReponse<Cart>>{
        return this.cartservice.addtoCart(cartdto,user);
    }
    @Post('/checkout')
    @UseGuards(AuthGuard())
    async checkout(@GetUser() user:User):Promise<IReponse<Cart>>{
        return this.cartservice.checkout(user);
    }

    @Post('/dividepassbook/:quantity')
    @UseGuards(AuthGuard())
    async dividePassbook(@GetUser() user:User,@Param('quantity') quantity:number):Promise<IReponse<Cart>>{
        return this.cartservice.dividePassbook(quantity,user);
    }
} 