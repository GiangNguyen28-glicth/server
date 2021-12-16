import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/User/User.service"
import * as nodemailer from 'nodemailer';
import { google } from "googleapis";

@Injectable()
export class MailService{
    constructor(@Inject(forwardRef(() => UserService)) private userService: UserService,private jwtservice:JwtService){}
    oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_CLIENT_REDIRECT_URI
    );
  
    async sendEmail(email:string): Promise<void>{
        this.oAuth2Client.setCredentials({refresh_token:process.env.GOOGLE_CLIENT_REFRESH_TOKEN});
        const accessToken = await this.oAuth2Client.getAccessToken(); 
        const payload={email};
        const token = this.jwtservice.sign(payload, {
        secret: process.env.JWT_VERIFICATION_TOKEN_SECRET,
        expiresIn: `${process.env.JWT_VERIFICATION_TOKEN_EXPIRATION_TIME}s`
        });
        const url = `${process.env.EMAIL_CONFIRMATION_URL}?token=${token}`;
        // const transporter = nodemailer.createTransport({
        //   service: 'gmail',
        //   port:600,
        //   secure:true,
        //   auth: {
        //     type: 'OAuth2',
        //     user: '103tmdt@gmail.com',
        //     clientId:process.env.GOOGLE_CLIENT_ID,
        //     clientSecret:process.env.GOOGLE_CLIENT_SECRET,
        //     refreshToken:process.env.GOOGLE_CLIENT_REFRESH_TOKEN,
        //     accessToken:accessToken,
        //   },
        // });
        let transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: "103tmdt@gmail.com", // generated ethereal user
            pass: "Giang123@123@@", // generated ethereal password
          },
        });
        const info = await transporter.sendMail({
          from:process.env.FROM_EMAIL, // sender address
          to: email, // list of receivers
          subject: 'Confirm Mail ✔', // Subject line
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