import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/User/User.service"
import * as nodemailer from 'nodemailer';
var SibApiV3Sdk = require('sib-api-v3-sdk');
@Injectable()
export class MailService{
    constructor(@Inject(forwardRef(() => UserService)) private userService: UserService,private jwtservice:JwtService){}
    async sendEmail(email:string): Promise<void>{

        var defaultClient = SibApiV3Sdk.ApiClient.instance;
        const payload={email};
        const token = this.jwtservice.sign(payload, {
        secret: process.env.JWT_VERIFICATION_TOKEN_SECRET,
        expiresIn: `${process.env.JWT_VERIFICATION_TOKEN_EXPIRATION_TIME}s`
        });
        var apiKey = defaultClient.authentications["api-key"];
        apiKey.apiKey =process.env.SENGRID_API;

        const url = `${process.env.EMAIL_CONFIRMATION_URL}?token=${token}`;
        const transporter = nodemailer.createTransport({
          host: 'smtp-relay.sendinblue.com',
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: process.env.FROM_EMAIL, // generated ethereal user
            pass: process.env.PASS_EMAIL, // generated ethereal password
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
       
        // var apiInstance = new SibApiV3Sdk.ContactsApi();
        // var createContact = new SibApiV3Sdk.CreateContact();
        // createContact.email=email;
        // createContact.Listids=[2];
        // apiInstance.createContact(createContact).then((data)=>{
        //    console.log(1)
        // },function(error){
        //   console.log(error);
        // })
        // var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
        // var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email
        // sendSmtpEmail = {
        //   sender: { email: "19110354@student.hcmute.edu.vn" },
        //   to: [
        //     {
        //       email: email,
        //       name: "Person Name",
        //     },
        //   ],
        //   subject: "Test Email",
        //   textContent: "Test Email Content",
        // };
        // apiInstance.sendTransacEmail(sendSmtpEmail).then(
        //   function (data) {
        //     console.log(1);
        //   },
        //   function (error) {
        //     console.log(2);
        //   }
        // );
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