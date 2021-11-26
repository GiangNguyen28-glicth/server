import { Body, Controller, Get, Post, Render, Req, Res, UseGuards } from "@nestjs/common";
import { PaypalService } from "./Paypay.service";
import {  Request,Response } from "express";
import { Checkout } from "./DTO/checkout.dto";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "src/decorators/getuser.decorators";
import { User } from "src/User/Schema/User.Schema";
@Controller('/paypal')
export class PaypalController{
    constructor(private paypalservice:PaypalService){}
    @Post('/checkout')
    @UseGuards(AuthGuard())
    PayPal(@Res() response:Response,@Body() checkout:Checkout,@GetUser() user:User){
        console.log(checkout.money);
        return this.paypalservice.Payment(response,checkout.money,user);
    }
    @Get('/')
    @Render('index')
    Home(){
        
    }

    @Get('/success')
    Success(@Res() response:Response,@Req() request:Request){
       return this.paypalservice.Success(response,request);
    }
    
    @Get('/cancel')
    Cancel(@Res() response:Response,@Req() request:Request){
       return "Cancel"
    }
}