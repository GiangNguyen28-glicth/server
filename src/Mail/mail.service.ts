import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/User/User.service"
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService{
    constructor(@Inject(forwardRef(() => UserService)) private userService: UserService,private jwtservice:JwtService){}
  
    async sendEmail(email:string): Promise<void>{
        const payload={email};
        const token = this.jwtservice.sign(payload, {
        secret: process.env.JWT_VERIFICATION_TOKEN_SECRET,
        expiresIn: `${process.env.JWT_VERIFICATION_TOKEN_EXPIRATION_TIME}s`
        });
        const url = `${process.env.EMAIL_CONFIRMATION_URL}?token=${token}`;
        const transporter = nodemailer.createTransport({
          port: 587,
          host: "smtp.gmail.com",
          auth: {
            user: "shopme293@gmail.com",
            pass: "nxcyezzyxxuqvxor",
          },
          secure: false,
      });
      
      await new Promise((resolve, reject) => {
          // verify connection configuration
          transporter.verify(function (error, success) {
              if (error) {
                  console.log(1);
                  reject(error);
              } else {
                  console.log("Server is ready to take our messages");
                  resolve(success);
              }
          });
      });
      
      const mailData = {
        from: process.env.FROM_EMAIL,
        to: email,
        subject: 'Confirm Mail ✔',
        html:  `<b>Hello world?</b> <a href="${url}"> confirm Email</a>`,
      };
      
      await new Promise((resolve, reject) => {
          // send mail
          transporter.sendMail(mailData, (err, info) => {
              if (err) {
                  console.error(err);
                  reject(err);
              } else {
                  console.log(info);
                  resolve(info);
              }
          });
      });
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
        await this.sendEmail(user.email);
      }
}