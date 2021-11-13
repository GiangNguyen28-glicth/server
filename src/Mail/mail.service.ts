import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import * as nodemailer from 'nodemailer';
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/User/User.service";
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
            host: 'smtp.sendgrid.net',
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
              user: 'apikey', // generated ethereal user
              pass: process.env.SENGRID_API, // generated ethereal password
            },
          });
          // send mail with defined transport object
            const info = await transporter.sendMail({
            from:process.env.FROM_EMAIL, // sender address
            to: email, // list of receivers
            subject: 'Hello ✔', // Subject line
            text: 'Hello world?', // plain text body
            html: `<b>Hello world?</b> <a href="${url}"> confirm Email</a>`, // html body
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