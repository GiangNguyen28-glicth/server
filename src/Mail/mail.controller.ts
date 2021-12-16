import { Controller, Get, Post, Query, UseGuards } from "@nestjs/common";;
import { GetUser } from "src/decorators/getuser.decorators";
import { User } from "src/User/Schema/User.Schema";
import { confirmEmail } from "./confirm.dto";
import { MailService } from "./mail.service";

@Controller('')
export class MailController{
    constructor(private mailservice:MailService){}
    @Get('/confirm-email')
    async confirm(@Query() token:confirmEmail) {
      const email = await this.mailservice.decodeConfirmationToken(token.token);
      await this.mailservice.confirmEmail(email);
      return "Confirm success"
    }
    @Get('/resend-confirm-email')
    async resendConfirmationLink(@GetUser() user:User):Promise<void>{
      return await this.mailservice.resendConfirmationLink(user._id);
    }
}