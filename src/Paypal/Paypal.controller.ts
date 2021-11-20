import { Body, Controller, Get, Post, Render, Req, Res } from "@nestjs/common";
import { PaypalService } from "./Paypay.service";
import {  Request,Response } from "express";
import { Checkout } from "./DTO/checkout.dto";
@Controller('/paypal')
export class PaypalController{
    constructor(private paypalservice:PaypalService){}
    @Post('/checkout')
    PayPal(@Res() response:Response,@Body() checkout:Checkout){
        console.log(checkout.money);
        return this.paypalservice.Payment(response,checkout.money);
    }
    @Get('/')
    @Render('index')
    Home(){
        
    }
    @Get('/success')
    Success(@Res() response:Response,@Req() request:Request){
       return this.paypalservice.Success(response,request);
    }
    
}