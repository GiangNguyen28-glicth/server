import { BadRequestException, forwardRef, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserDTO, UserRole } from "./DTO/user.dto";
import { User, UserDocument } from "./Schema/User.Schema";
import * as bcrypt from 'bcrypt';
import { UserReponse } from "./User.Reponse";
import { MailService } from "src/Mail/mail.service";
import { JwtService } from "@nestjs/jwt";
import { OTP, OTPDocument } from "src/User/Schema/sms.schema";
import { InjectTwilio, TwilioClient } from "nestjs-twilio";
import { Twilio } from "twilio";
import { changePassword } from "./DTO/ChangePassword.dto";

@Injectable()
export class UserService{
    constructor(
    @InjectModel(User.name) private usermodel:Model<UserDocument>,
    @InjectModel(OTP.name) private otpmodel:Model<OTPDocument>,
    @InjectTwilio() private readonly twilioClient: TwilioClient,
    @Inject(forwardRef(() => MailService))
    private mailservice: MailService,
    private jwtservice:JwtService){
      this.twilioClient = new Twilio(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN)
    }


    async register(userdto:UserDTO):Promise<UserReponse>{
      const role=UserRole.USER;
        const { firstName, lastName,password,email,phoneNumber,CMND } =userdto;
        userdto.role=role;
        const userExisting= await this.usermodel.findOne({phoneNumber:phoneNumber});
        if(userExisting){
            return{
              code:500,
              success:false,
              message:"User Existing"
            }
        }
        try{
            const salt = await bcrypt.genSalt();
            const hashedpassword = await bcrypt.hash(password, salt);
            const user = this.usermodel.create({firstName,lastName,password:hashedpassword,email,phoneNumber,CMND,role});
            this.mailservice.sendEmail(email);
            (await user).save();
            return {
              code:200, success:true,message:"Success",
              user:{
                _id:(await user)._id,phoneNumber,email,CMND,firstName,lastName,role
              }
            };
        }
        catch(err){
          return{
            code:500,
            success:false,
            message:`Failed Because ${err.message}`,
          }
        }
    } 


    async getByEmail(email:string):Promise<User>{
      return await this.usermodel.findOne({email:email});
    }


    async markEmailAsConfirmed(email: string):Promise<User> {
      return this.usermodel.findOneAndUpdate({email:email}, {
        createdAt:null,
        isEmailConfirmed: true,
      });
    }


    async getByID(id):Promise<User>{
      return this.usermodel.findOne({_id:id});
    }


    async Login({email,password}):Promise<{accesstoken:string}>{ 
      const user=await this.usermodel.findOne({email:email});
      if (user && (await bcrypt.compare(password, user.password))&&user.isEmailConfirmed) {
          let id=user._id;
          const payload= {id};
          const accesstoken = await this.jwtservice.sign(payload);
          return {accesstoken};
      } else {
          throw new UnauthorizedException('Please Check Account');
      }
    }


    async forgotpassword(phoneNumber:string):Promise<{accesstoken:string}>{
      const user=await this.usermodel.findOne({phoneNumber:phoneNumber});
      if(!user){
        throw new UnauthorizedException('Phone Number not existing');
      }
      await this.otpmodel.findOneAndDelete({phoneNumber:user.phoneNumber});
      const otp=await this.otpmodel.create({userId:user._id,phoneNumber:phoneNumber})
      otp.save();
      this.sendSMS(phoneNumber);
      let _id=user._id;
      const payload= {_id};
      const accesstoken = await this.jwtservice.sign(payload);
      return {accesstoken};
    }

    async sendSMS(phoneNumber:string) {
      const serviceSid = process.env.TWILIO_VERIFICATION_SERVICE_SID;
      return this.twilioClient.verify.services(serviceSid)
        .verifications
        .create({ to: phoneNumber, channel: 'sms' })
    }


    async confirmPhoneNumber(userId, phoneNumber: string, verificationCode: string) {
      const serviceSid = process.env.TWILIO_VERIFICATION_SERVICE_SID;
      const otp=await this.otpmodel.findOne({userId:userId});
      if (otp.isPhoneNumberConfirmed) {
        throw new BadRequestException('Phone number already confirmed');
      }
      const result = await this.twilioClient.verify.services(serviceSid)
        .verificationChecks
        .create({to:  phoneNumber, code: verificationCode})
      if (!result.valid || result.status !== 'approved') {
        throw new BadRequestException('Wrong code provided');
      }
      this.markPhoneNumberAsConfirmed(userId);
    }

    async markPhoneNumberAsConfirmed(userId) {
      return this.otpmodel.findOneAndUpdate({ userId:userId }, {
        isPhoneNumberConfirmed: true
      });
    }


    async changPassword(userId,changepassword:changePassword):Promise<UserReponse>{
      const {newPassword,ConfirmPassword}=changepassword;
      const resetPasswordRecord = await this.otpmodel.findOne({userId:userId});
      if(!resetPasswordRecord){
        return{
          code: 400,
					success: false,
					message: 'Invalid or expired password reset OTP',
        }
      }
      const user = await this.usermodel.findOne({_id:userId});
      if (!user) {
				return {
					code: 400,
					success: false,
					message: 'User no longer exists',
				}
			}
      if(newPassword!=ConfirmPassword){
        return{
          code:400,
          success:false,
          message:"password does not match"
        }
      }
      const salt = await bcrypt.genSalt();
      const hashedpassword = await bcrypt.hash(newPassword, salt);
      await this.usermodel.findOneAndUpdate({ _id:userId }, { password: hashedpassword })
      await resetPasswordRecord.deleteOne();
      return {
				code: 200,
				success: true,
				message: 'User password reset successfully',
				user
			}
    }
}