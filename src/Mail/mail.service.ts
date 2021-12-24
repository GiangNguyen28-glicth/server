import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/User/User.service"
import * as nodemailer from 'nodemailer';
import { MailAction } from "./confirm.dto";
import { MailTemplateVerifyLink } from "../emailtemplate/emailVerifyLink";
import { MailTemplateVerifyCode } from "src/emailtemplate/emailVerifycode";
import { MailResetPassword } from "src/emailtemplate/emailResetPassword";
@Injectable()
export class MailService{
    constructor(@Inject(forwardRef(() => UserService)) private userService: UserService,private jwtservice:JwtService){}
  
    async sendEmail(email:string,option:string,code?:string,fullname?:string,message?:string): Promise<void>{
        let html;
        const payload={email};
        const token =await this.jwtservice.sign(payload, {
        secret: process.env.JWT_VERIFICATION_TOKEN_SECRET,
        expiresIn: `${process.env.JWT_VERIFICATION_TOKEN_EXPIRATION_TIME}s`
        });
        html=this.configtemplate(option,code,fullname,message,token)
        const transporter =await nodemailer.createTransport({
          service:"gmail",
          auth: {
            user: "shopme293@gmail.com",
            pass: "nxcyezzyxxuqvxor", // naturally, replace both with your real credentials or an application-specific password
          },
        });
        const mailOptions = {
          from: process.env.FROM_EMAIL,
          to: email,
          subject: 'Confirm Mail ✔',
          html: html,
        };
        await transporter.sendMail(mailOptions);
    }
    async decodeConfirmationToken(token: string) {
        try {
          const payload = await this.jwtservice.verify(token, {
            secret:process.env.JWT_VERIFICATION_TOKEN_SECRET,
          });
          if (typeof payload === 'object' && 'email' in payload) {
            return payload.email;
          }
          throw new BadRequestException();
        } catch (error) {
          if (error?.name === 'TokenExpiredError') {
            throw new BadRequestException('Email confirmation token expired');
          }
          console.log(error.message);
          throw new BadRequestException('Bad confirmation token');
        }
      }

      async confirmEmail(email: string) {
        const user = await this.userService.getByEmail(email);
        if (user.isEmailConfirmed) {
          throw new BadRequestException('Email already confirmed');
        }
        await this.userService.markEmailAsConfirmed(email);
      }  

      configtemplate(option:string,code?:string,fullname?:string,message?:string,token?:string):any{
        let html;
        if(option==MailAction.LG){
          MailTemplateVerifyCode.code=code
          MailTemplateVerifyCode.fullname=fullname;
          html=MailTemplateVerifyCode.HTMLCode();
        }
        else if(option==MailAction.RS){
          MailResetPassword.fullname=fullname;
          html=MailResetPassword.ResetPassword();
        }
        else if(option==MailAction.MN){

        }
        else{
          MailTemplateVerifyLink.link= `${process.env.EMAIL_CONFIRMATION_URL}?token=${token}`;
          MailTemplateVerifyLink.fullname=fullname;
          html=MailTemplateVerifyLink.HTMLLink();
        }
        return html;
      }
}