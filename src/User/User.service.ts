import { BadRequestException, forwardRef, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserDTO, UserRole } from "./DTO/user.dto";
import { User, UserDocument } from "./Schema/User.Schema";
import * as bcrypt from 'bcrypt';
import { MailService } from "src/Mail/mail.service";
import { JwtService } from "@nestjs/jwt";
import { OTP, OTPDocument } from "src/User/Schema/sms.schema";
import { InjectTwilio, TwilioClient } from "nestjs-twilio";
import { Twilio } from "twilio";
import { changePassword } from "./DTO/ChangePassword.dto";
import { IReponse } from "src/Utils/IReponse";
import { SavingsDepositService } from "src/SavingsDeposit/SavingsDeposit.service";
import * as mongoose from 'mongoose';
import { SavingsDeposit } from "src/SavingsDeposit/Schema/SavingsDeposit.Schema";
import { UpdateProfileDTO } from "./DTO/UpdateProfile.dto";
import { Action, HistoryAction } from "./DTO/HistoryAction.obj";
@Injectable()
export class UserService{
  
    constructor(
    @InjectModel(User.name) private usermodel:Model<UserDocument>,
    @InjectModel(OTP.name) private otpmodel:Model<OTPDocument>,
    @InjectTwilio() private readonly twilioClient: TwilioClient,
    @InjectConnection() private readonly connection: mongoose.Connection,
    @Inject(forwardRef(() => SavingsDepositService))
    private savingsdepositservice: SavingsDepositService,
    @Inject(forwardRef(() => MailService))
    private mailservice: MailService,
    private jwtservice:JwtService){
      this.twilioClient = new Twilio(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN)
    }


    async register(userdto:UserDTO):Promise<IReponse<User>>{
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
              objectreponse:{
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
    async deleteUser(id):Promise<IReponse<User>>{
      const session =await this.connection.startSession();
      await session.startTransaction()
      try{
        const userExisting=await this.usermodel.findOne({_id:id});
        if(!userExisting){
          return{
            code:200,
            success:false,
            message:"User not existing"
          }
        }
        const savingsdeposit=userExisting.savingsDeposit;
      }catch(err){
        session.abortTransaction();
        return{
          code:200,
          success:false,
          message:err.message
        }
      }
    }

    async updateProfile(updateprofile:UpdateProfileDTO,id):Promise<IReponse<User>>{
      const userExisting= await this.usermodel.findOneAndUpdate({_id:id},updateprofile);
      return{
        code:200,
        success:true,
        message:"Update profile success"
      }

    }

    async getByEmail(email:string):Promise<User>{
      return await this.usermodel.findOne({email:email});
    }


    async markEmailAsConfirmed(email: string):Promise<User> {
      return this.usermodel.findOneAndUpdate({email:email}, {
        isExprise:null,
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


    async changPassword(userId,changepassword:changePassword):Promise<IReponse<User>>{
      const {newPassword,ConfirmPassword}=changepassword;
      const resetPasswordRecord = await this.otpmodel.findOne({userId:userId});
      console.log(resetPasswordRecord.isPhoneNumberConfirmed);
      if(!resetPasswordRecord&&resetPasswordRecord.isPhoneNumberConfirmed){
        return{
          code: 400,
					success: false,
					message: 'Invalid or expired password reset OTP',
        }
      }
      if(!resetPasswordRecord.isPhoneNumberConfirmed){
        return{
          code: 400,
					success: false,
					message: 'OTP ?',
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
			}
    }
    
    async updateSvd(input:SavingsDeposit,user:User):Promise<void>{
      const result=await this.usermodel.findByIdAndUpdate({_id:user._id});
      result.savingsDeposit.push(input);
      result.save();
    }

    async updatePassword(changepassword:changePassword,user:User):Promise<IReponse<User>>{
      const {oldPassword,newPassword,ConfirmPassword}=changepassword;
      if((await bcrypt.compare(oldPassword,user.password))){
        if(newPassword==ConfirmPassword){
          const salt = await bcrypt.genSalt();
          const hashedpassword = await bcrypt.hash(newPassword, salt);
          await this.usermodel.findOneAndUpdate({_id:user._id},{password:hashedpassword});
          return{
            code:200,
            success:true,
            message:"Update Password Success"
          }
        }
        else{
          return{
            code:400,
            success:false,
            message:"Password not match"
          }
        }
      }
      else{
        return{
          code:400,
          success:false,
          message:"Please check old password"
        }
      }
    }

    async updateMoney(action:string,money:number,user:User):Promise<void>{
      let newMoney;
      if(action===Action.OPENPASSBOOK){
        newMoney=user.currentMoney-money;
      }
      else if(action==Action.NAPTIENPAYPAL||action==Action.NAPTIENATM){
        newMoney=user.currentMoney+money;
      }
      const userExisting=await this.usermodel.findOneAndUpdate({_id:user._id},{currentMoney:newMoney});
    }

    async updateNewAction(historyaction:HistoryAction,user:User):Promise<void>{
       const userExisting=await this.usermodel.findOne({_id:user._id});
       userExisting.historyaction.push(historyaction);
       userExisting.update();
       userExisting.save();
    }
}