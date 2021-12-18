import { Controller, Get, Post, Query, Res, UseGuards } from "@nestjs/common";;
import { GetUser } from "src/decorators/getuser.decorators";
import { User } from "src/User/Schema/User.Schema";
import { confirmEmail } from "./confirm.dto";
import { MailService } from "./mail.service";
import { Response } from "express";
@Controller('')
export class MailController{
    constructor(private mailservice:MailService){}
    @Get('/confirm-email')
    async confirm(@Query() token:confirmEmail,@Res() response:Response) {
      const email = await this.mailservice.decodeConfirmationToken(token.token);
      await this.mailservice.confirmEmail(email);
      response.redirect("https://fe-next-ecommerce.vercel.app");
    }
}