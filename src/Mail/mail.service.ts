import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/User/User.service"
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from "path"
@Injectable()
export class MailService{
    constructor(@Inject(forwardRef(() => UserService)) private userService: UserService,private jwtservice:JwtService){}
  
    async sendEmail(email:string,option:string,code?:string): Promise<void>{
        const payload={email};
        const token = this.jwtservice.sign(payload, {
        secret: process.env.JWT_VERIFICATION_TOKEN_SECRET,
        expiresIn: `${process.env.JWT_VERIFICATION_TOKEN_EXPIRATION_TIME}s`
        });
        let html;
        if(option=="LG"){
          html = fs.readFileSync(path.resolve(__dirname, '../emailtemplate/emailVerifycode.hbs'), {
            encoding: "utf-8",
          });
          const url = `${process.env.EMAIL_CONFIRMATION_URL}?token=${token}`;
          console.log(2);
          html = html.replace("<%NAME>","ADMIN" );
          html = html.replace("<%CODE>",code);
        }
        else{
          const url = `${process.env.EMAIL_CONFIRMATION_URL}?token=${token}`;
          
          console.log(1);
          html = fs.readFileSync(path.resolve(__dirname, '../emailtemplate/emailVerify.hbs'), {
            encoding: "utf-8",
          });
          html = html.replace("<%NAME>","ADMIN" );
          html = html.replace("<%LINK>",url);
        }
        const transporter =await nodemailer.createTransport({
          service:"gmail",
          auth: {
            user: "shopme293@gmail.com",
            pass: "nxcyezzyxxuqvxor", // naturally, replace both with your real credentials or an application-specific password
          },
        });
      
        // 2. Tao email option
        const mailOptions = {
          from: process.env.FROM_EMAIL,
          to: email,
          subject: 'Confirm Mail ✔',
          html: html,
          // attachments: options.attachments,
        };
        // 3. Gui email
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


      async resendConfirmationLink(id) {
        const user = await this.userService.getByID(id);
        if (!user||user.isEmailConfirmed) {
          throw new BadRequestException('Email already confirmed');
        }
        await this.sendEmail(user.email,"PW");
      }
}