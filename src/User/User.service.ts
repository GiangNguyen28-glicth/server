import { BadRequestException, Body, ForbiddenException, forwardRef, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
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
import * as mongoose from 'mongoose';
import { UpdateProfileDTO } from "./DTO/UpdateProfile.dto";
import { Action, HistoryAction } from "./DTO/HistoryAction.obj";
import { Checkout } from "src/Paypal/DTO/checkout.dto";
import { PassBookService } from "src/PassBook/PassBook.service";
import { PassBook } from "src/PassBook/Schema/PassBook.Schema";
import { CommonService } from "src/Utils/common.service";
import { MailAction } from "src/Mail/confirm.dto";
@Injectable()
export class UserService{
  
    constructor(
    @InjectModel(User.name) private usermodel:Model<UserDocument>,
    @InjectModel(OTP.name) private otpmodel:Model<OTPDocument>,
    @InjectTwilio() private readonly twilioClient: TwilioClient,
    @InjectConnection() private readonly connection: mongoose.Connection,
    @Inject(forwardRef(() => PassBookService))
    private passbookservice: PassBookService,
    @Inject(forwardRef(() => MailService))
    private mailservice: MailService,
    private jwtservice:JwtService,
    private commonservice:CommonService){
      this.twilioClient = new Twilio("AC6217c0554f4b02fd75b70f57d12e77b",process.env.TWL1+process.env.TWL2)
    }
    phone;
    async register(userdto:UserDTO):Promise<IReponse<User>>{
      const role=UserRole.USER;
        let phoneNumber="+84"+userdto.phoneNumber.slice(1,userdto.phoneNumber.length);
        const { firstName, lastName,password,email,CMND,address,passwordConfirm } =userdto;
        userdto.role=role;
        if(passwordConfirm!=password){
          return{code:500,success:false,message:"Password not match"}
        }
        const userExistingEmail= await this.usermodel.findOne({email:email});
        if(userExistingEmail){
            return{code:500,success:false,message:"Email Existing"}
        }
        const userExistingPhone= await this.usermodel.findOne({phoneNumber:phoneNumber});
        if(userExistingPhone){
          return{code:500,success:false,message:"Phone Number Existing"}
        }
        try{
            const date= await this.commonservice.convertDatetime(new Date());
            const salt = await bcrypt.genSalt();
            const hashedpassword = await bcrypt.hash(password, salt);
            const user = this.usermodel.create({firstName,lastName,password:hashedpassword,email,phoneNumber,CMND,address,role,isChangePassword:date});
            await this.mailservice.sendEmail(email,MailAction.PW);
            (await user).save();
            return {
              code:200, success:true,message:"Success",
              objectreponse:{
                _id:(await user)._id,phoneNumber,email,CMND,firstName,lastName,address,role
              }
            };
        }
        catch(err){
          return{code:500,success:false,message:`Failed Because ${err.message}`}
        }
    } 
    async deleteUser(id):Promise<IReponse<User>>{
      const session =await this.connection.startSession();
      await session.startTransaction()
      try{
        const userExisting=await this.usermodel.findOne({_id:id});
        if(!userExisting){
          return{code:200,success:false,message:"User not existing"}
        }
      }catch(err){
        session.abortTransaction();
        return{code:200,success:false,message:err.message
        }
      }
    }

    async updateProfile(updateprofile:UpdateProfileDTO,id):Promise<IReponse<User>>{
      const userExisting= await this.usermodel.findOneAndUpdate({_id:id},updateprofile);
      return{code:200,success:true,message:"Update profile success"}
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

    async Login({email,password}):Promise<any>{ 
      const user=await this.usermodel.findOne({email:email});
      if (user && (await bcrypt.compare(password, user.password))&&user.isEmailConfirmed) {
        this.phone=user.phoneNumber;
        const code=await this.randomotp();
        await this.mailservice.sendEmail(email,MailAction.LG,code,user.fullName);
        await this.otpmodel.findOneAndDelete({phoneNumber:user.phoneNumber});
        const otp=await this.otpmodel.create({userId:user._id,phoneNumber:user.phoneNumber,code:code})
        otp.save();
        return{
            code:200,success:true,message:"Check otp"
        }
      } else {
          throw new UnauthorizedException('Please Check Account');
      }
    }

    async forgotpassword(email:string):Promise<void>{
      // let phonereplace="+84"+phoneNumber.slice(1,phoneNumber.length);
      const user=await this.usermodel.findOne({email:email});
      if(!user){
        throw new UnauthorizedException('Email not existing');
      }
      const random=await this.randomotp();
      await this.otpmodel.findOneAndDelete({phoneNumber:user.phoneNumber});
      const otp=await this.otpmodel.create({userId:user._id,phoneNumber:user.phoneNumber});
      otp.save();
      await this.mailservice.sendEmail(user.email,MailAction.LG,random,user.fullName);
      //await this.sendSMS(user.phoneNumber);
    }

    async sendSMS(phoneNumber:string):Promise<any> {
      const serviceSid = "VAa8323d40b3ccf4ca0d124b0efde8764d";
      this.phone=phoneNumber;
      if(!this.phone){
        return{
          code:500,success:false,message:"Phone number null"
        }
      }
      // await this.mailservice.sendEmail()
      // this.twilioClient.verify.services(serviceSid)
      // .verifications
      // .create({ to: phoneNumber, channel: 'sms' })
      // await this.twilioClient.messages.create({body: code,to:phoneNumber,from:process.env.TWILIO_PHONE_NUMBER})
    }

    async confirmPhoneNumber(verificationCode: string):Promise<{accessToken}>{
      const serviceSid = "VAa8323d40b3ccf4ca0d124b0efde8764d";
      const otp=await this.otpmodel.findOne({code:verificationCode});
      if(!otp){
        throw new BadRequestException('OTP is Expries or not existing');
      }
      if(otp.code!=verificationCode){
        throw new BadRequestException('Wrong code provided');
      }
      // const result = await this.twilioClient.verify.services(serviceSid)
      // .verificationChecks
      // .create({to: otp.phoneNumber, code: verificationCode})
      // if (!result.valid || result.status !== 'approved') {
      //   throw new BadRequestException('Wrong code provided');
      // }
      let id=otp.userId;
      const payload= {id};
      const accessToken = await this.jwtservice.sign(payload);
      otp.delete();
      return {accessToken};
    }

    async markPhoneNumberAsConfirmed(userId) {
      return this.otpmodel.findOneAndUpdate({ userId:userId }, {
        isPhoneNumberConfirmed: true
      });
    }


    async changPassword(userId,changepassword:changePassword):Promise<IReponse<User>>{
      const date=await this.commonservice.convertDatetime(new Date());
      const {newPassword,ConfirmPassword}=changepassword;
      const user = await this.usermodel.findOne({_id:userId});
      if (!user) {
				return {	code: 400,success: false,message: 'User no longer exists',}
			}
      if(newPassword!=ConfirmPassword){
        return{code:400,success:false,message:"password does not match"
        }
      }
      const salt = await bcrypt.genSalt();
      const hashedpassword = await bcrypt.hash(newPassword, salt);
      await this.usermodel.findOneAndUpdate({ _id:userId }, { password: hashedpassword,isChangePassword:date })
      return {code: 200,success: true,message: 'User password reset successfully',}
    }
    
    async updateSvd(input:PassBook,user:User):Promise<void>{
      const result=await this.usermodel.findByIdAndUpdate({_id:user._id});
      // result.savingsDeposit.push(input);
      result.save();
    }

    async updatePassword(changepassword:changePassword,user:User):Promise<IReponse<User>>{
      const {oldPassword,newPassword,ConfirmPassword}=changepassword;
      if((await bcrypt.compare(oldPassword,user.password))){
        if(newPassword==ConfirmPassword){
          const date=await this.commonservice.convertDatetime(new Date());
          const salt = await bcrypt.genSalt();
          const hashedpassword = await bcrypt.hash(newPassword, salt);
          await this.usermodel.findOneAndUpdate({_id:user._id},{password:hashedpassword,isChangePassword:date});
          return{code:200,success:true,message:"Update Password Success"}
        }
        else{
          return{code:400,success:false,message:"Password not match"}
        }
      }
      else{
        return{code:400,success:false,message:"Please check old password"}
      }
    }

    async updateMoney(action:string,money:number,user:User):Promise<any>{
      let newMoney;
      if(action===Action.OPENPASSBOOK){
        newMoney=user.currentMoney-money;
      }
      else if(action==Action.NAPTIENPAYPAL||action==Action.NAPTIENATM||action==Action.WITHDRAWAL){
        newMoney=user.currentMoney+money;
      }
      await this.usermodel.findOneAndUpdate({_id:user._id},{currentMoney:newMoney});
    }

    async updateNewAction(historyaction:HistoryAction,user:User):Promise<void>{
       const userExisting=await this.usermodel.findOne({_id:user._id});
       userExisting.historyaction.push(historyaction);
       userExisting.update();
       userExisting.save();
    }

    async NaptienATM(@Body() checkout:Checkout,user:User):Promise<IReponse<User>>{
      await this.updateMoney(Action.NAPTIENATM,checkout.money,user);
      const historyaction=new HistoryAction();
      historyaction.action=Action.NAPTIENATM;
      historyaction.createAt=new Date();
      historyaction.money=checkout.money;
      await this.updateNewAction(historyaction,user);
      return{
        code:200,success:true,message:"Nap tien thanh cong"
      }
    }

    async getAllTransaction(user:User):Promise<[HistoryAction]>{
      const result= await this.usermodel.findOne({_id:user._id});
      return result.historyaction;
    }

    async getUser(id):Promise<any>{
      const user= await this.usermodel.findOne({_id:id});
      if(!user){
        return {
          code:500,success:false,message:"User not existing"
        }
      }
      return {
        data:{firstname:user.firstName,lastname:user.lastName,fullname:user.fullName,money:user.currentMoney,
        address:user.address,phonenumnber:user.phoneNumber,email:user.email}
      }
    }

    async updateRole(role:string,user:User):Promise<any>{
      const updateuser= await this.usermodel.findOneAndUpdate({_id:user._id},{role:UserRole.ADMIN})
    }

    async LoginAsAdministrtor({email,password}):Promise<any>{
      const user=await this.usermodel.findOne({email:email});
      if (user && (await bcrypt.compare(password, user.password))&&user.isEmailConfirmed) {
        if(user.role==UserRole.USER){
          throw new ForbiddenException('Ban khong du quyen');
        }
        let id=user._id;
        const payload= {id};
        const accessToken = await this.jwtservice.sign(payload);
        return {accessToken};
      } else {
          throw new UnauthorizedException('Please Check Account');
      }
    }
    
    async getListUser():Promise<User[]>{
      return await this.usermodel.find({role:UserRole.USER,isEmailConfirmed:true});
    }

    async randomotp():Promise<string>{
      let code;
      while(true){
        code=Math.floor(Math.random() * (999999 -100000 + 1)) + 100000;
        const otp=await this.otpmodel.findOne({code:code});
        if(!otp){
          break;
        }
      }
      return code;
    }

    
}