import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/decorators/getuser.decorators';
import { User } from 'src/User/Schema/User.Schema';
import { CartService } from './Cart.service';
import { CartDTO } from './DTO/Cart.dto';

@Controller('/cart')
export class CartController {
  constructor(private cartservice: CartService) {}
  @Post('/')
  @UseGuards(AuthGuard())
  async addtoCart(
    @Body() cartdto: CartDTO,
    @GetUser() user: User,
  ): Promise<any> {
    return this.cartservice.addtoCart(cartdto, user);
  }
  // @Post('/checkout')
  // @UseGuards(AuthGuard())
  // async checkout(@GetUser() user:User):Promise<IReponse<Cart>>{
  //     return this.cartservice.checkout(user);
  // }

  @Post('/checkout')
  @UseGuards(AuthGuard())
  async dividePassbook(@GetUser() user: User): Promise<any> {
    return this.cartservice.checkoutPassbook(user);
  }

  @Patch('/:quantity')
  @UseGuards(AuthGuard())
  async newSuggest(
    @Param('quantity') quantity,
    @GetUser() user: User,
  ): Promise<any> {
    return await this.cartservice.updateCart(quantity, user);
  }
}
