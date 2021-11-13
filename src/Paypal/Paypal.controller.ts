import { Controller, Get, Post, Render, Req, Res } from "@nestjs/common";
import { PaypalService } from "./Paypay.service";
import {  Request,Response } from "express";
@Controller('/paypal')
export class PaypalController{
    constructor(private paypalservice:PaypalService){}
    @Post('/checkout')
    PayPal(@Res() response:Response){
        return this.paypalservice.Pay(response);
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