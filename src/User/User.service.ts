import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDTO, UserRole } from './DTO/user.dto';
import { User, UserDocument } from './Schema/User.Schema';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/Mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { OTP, OTPDocument } from 'src/User/Schema/sms.schema';
import { changePassword } from './DTO/ChangePassword.dto';
import { IReponse } from 'src/Utils/IReponse';
import * as mongoose from 'mongoose';
import { UpdateProfileDTO } from './DTO/UpdateProfile.dto';
import { Action, HistoryAction } from './DTO/HistoryAction.obj';
import { Checkout } from 'src/Paypal/DTO/checkout.dto';
import { PassBookService } from 'src/PassBook/PassBook.service';
import { PassBook } from 'src/PassBook/Schema/PassBook.Schema';
import { CommonService } from 'src/Utils/common.service';
import { MailAction } from 'src/Mail/confirm.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private usermodel: Model<UserDocument>,
    @InjectModel(OTP.name) private otpmodel: Model<OTPDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
    @Inject(forwardRef(() => PassBookService))
    private passbookservice: PassBookService,
    @Inject(forwardRef(() => MailService))
    private mailservice: MailService,
    private jwtservice: JwtService,
    private commonservice: CommonService,
  ) {}
  phone;
  async register(userdto: UserDTO): Promise<IReponse<User>> {
    const role = UserRole.USER;
    let phoneNumber =
      '+84' + userdto.phoneNumber.slice(1, userdto.phoneNumber.length);
    const {
      firstName,
      lastName,
      password,
      email,
      CMND,
      address,
      passwordConfirm,
    } = userdto;
    userdto.role = role;
    if (passwordConfirm != password) {
      return { code: 500, success: false, message: 'Password not match' };
    }
    const userExistingEmail = await this.usermodel.findOne({ email: email });
    if (userExistingEmail) {
      if (!userExistingEmail.isEmailConfirmed) {
        await this.usermodel.findOneAndDelete({ email: email });
      } else {
        return { code: 500, success: false, message: 'Email đã tồn tại' };
      }
    }
    const userExistingPhone = await this.usermodel.findOne({
      phoneNumber: phoneNumber,
    });
    if (userExistingPhone) {
      return { code: 500, success: false, message: 'Số điện thoại đã tồn tại' };
    }
    try {
      const date = new Date();
      const salt = await bcrypt.genSalt();
      const hashedpassword = await bcrypt.hash(password, salt);
      const user = this.usermodel.create({
        firstName,
        lastName,
        password: hashedpassword,
        email,
        phoneNumber,
        CMND,
        address,
        role,
        isChangePassword: date,
      });
      await this.mailservice.sendEmail(
        email,
        MailAction.PW,
        '',
        firstName + lastName,
      );
      (await user).save();
      return {
        code: 200,
        success: true,
        message: 'Đăng ký tài khoản thành công',
        objectreponse: {
          _id: (await user)._id,
          phoneNumber,
          email,
          CMND,
          firstName,
          lastName,
          address,
          role,
        },
      };
    } catch (err) {
      return {
        code: 500,
        success: false,
        message: `Failed Because ${err.message}`,
      };
    }
  }
  async deleteUser(id): Promise<IReponse<User>> {
    const session = await this.connection.startSession();
    await session.startTransaction();
    try {
      const userExisting = await this.usermodel.findOne({ _id: id });
      if (!userExisting) {
        return { code: 200, success: false, message: 'User not existing' };
      }
    } catch (err) {
      session.abortTransaction();
      return { code: 200, success: false, message: err.message };
    }
  }

  async updateProfile(
    updateprofile: UpdateProfileDTO,
    id,
  ): Promise<IReponse<User>> {
    const userExisting = await this.usermodel.findOneAndUpdate(
      { _id: id },
      updateprofile,
    );
    if (!userExisting) {
      return { code: 200, success: false, message: 'User không tồn tại' };
    }
    return {
      code: 200,
      success: true,
      message: 'Cập nhật thông tin User thành công !',
    };
  }

  async getByEmail(email: string): Promise<User> {
    return await this.usermodel.findOne({ email: email });
  }

  async markEmailAsConfirmed(email: string): Promise<User> {
    return this.usermodel.findOneAndUpdate(
      { email: email },
      {
        isExprise: null,
        isEmailConfirmed: true,
      },
    );
  }

  async getByID(id): Promise<User> {
    return this.usermodel.findOne({ _id: id });
  }

  async Login({ email, password }): Promise<any> {
    const user = await this.usermodel.findOne({ email: email });
    if (
      user &&
      (await bcrypt.compare(password, user.password)) &&
      user.isEmailConfirmed
    ) {
      this.phone = user.phoneNumber;
      const code = await this.randomotp();
      await this.mailservice.sendEmail(
        email,
        MailAction.LG,
        code,
        user.fullName,
      );
      await this.otpmodel.findOneAndDelete({ phoneNumber: user.phoneNumber });
      const otp = await this.otpmodel.create({
        userId: user._id,
        phoneNumber: user.phoneNumber,
        code: code,
      });
      otp.save();
      return {
        code: 200,
        success: true,
        message: 'Check otp',
      };
    } else {
      throw new UnauthorizedException('Please Check Account');
    }
  }

  async forgotpassword(email: string): Promise<any> {
    const user = await this.usermodel.findOne({ email: email });
    if (!user) {
      return {
        code: 500,
        success: false,
        message: 'Email không tồn tại !',
      };
    }
    const random = await this.randomotp();
    await this.otpmodel.findOneAndDelete({ phoneNumber: user.phoneNumber });
    const otp = await this.otpmodel.create({
      userId: user._id,
      code: random,
      phoneNumber: user.phoneNumber,
    });
    otp.save();
    await this.mailservice.sendEmail(
      user.email,
      MailAction.RS,
      random,
      user.fullName,
    );
    return {
      code: 200,
      success: true,
      message: 'Kiểm tra Mail để lấy OTP',
    };
  }

  async confirmPhoneNumber(verificationCode: string): Promise<{ accessToken }> {
    const otp = await this.otpmodel.findOne({ code: verificationCode });
    if (!otp) {
      throw new BadRequestException('OTP đã hết hạn hoặc không tồn tại');
    }
    if (otp.code != verificationCode) {
      throw new BadRequestException('Wrong code provided');
    }
    let id = otp.userId;
    const payload = { id };
    const accessToken = await this.jwtservice.sign(payload);
    otp.delete();
    return { accessToken };
  }

  async markPhoneNumberAsConfirmed(userId) {
    return this.otpmodel.findOneAndUpdate(
      { userId: userId },
      {
        isPhoneNumberConfirmed: true,
      },
    );
  }

  async changPassword(changepassword: changePassword): Promise<IReponse<User>> {
    const date = await this.commonservice.convertDatetime(new Date());
    const { code, password, passwordConfirm } = changepassword;
    const otpexisting = await this.otpmodel.findOne({ code: code });
    if (!otpexisting) {
      return {
        code: 500,
        success: false,
        message: 'Mã OTP đã hết hạn hoặc không tồn tại',
      };
    }
    if (otpexisting.code != code) {
      return { code: 500, success: false, message: 'Mã OTP không đúng' };
    }
    const user = await this.usermodel.findOne({ _id: otpexisting.userId });
    if (!user) {
      return { code: 500, success: false, message: 'User không tồn tại' };
    }
    if (password != passwordConfirm) {
      return { code: 500, success: false, message: 'Mật khâu không khớp !!' };
    }
    const salt = await bcrypt.genSalt();
    const hashedpassword = await bcrypt.hash(password, salt);
    await this.usermodel.findOneAndUpdate(
      { _id: otpexisting.userId },
      { password: hashedpassword, isChangePassword: date },
    );
    return {
      code: 200,
      success: true,
      message: 'Cập nhật mật khẩu thành công',
    };
  }

  async updateSvd(input: PassBook, user: User): Promise<void> {
    const result = await this.usermodel.findByIdAndUpdate({ _id: user._id });
    // result.savingsDeposit.push(input);
    result.save();
  }

  async updatePassword(
    changepassword: changePassword,
    user: User,
  ): Promise<IReponse<User>> {
    const { oldpassword, password, passwordConfirm } = changepassword;
    if (await bcrypt.compare(oldpassword, user.password)) {
      if (password == passwordConfirm) {
        const date = await this.commonservice.convertDatetime(new Date());
        const salt = await bcrypt.genSalt();
        const hashedpassword = await bcrypt.hash(password, salt);
        await this.usermodel.findOneAndUpdate(
          { _id: user._id },
          { password: hashedpassword, isChangePassword: date },
        );
        return {
          code: 200,
          success: true,
          message: 'Cập nhật mật khẩu thành công',
        };
      } else {
        return { code: 500, success: false, message: 'Mật khẩu không khớp' };
      }
    } else {
      return { code: 500, success: false, message: 'Mật khẩu cũ không đúng' };
    }
  }

  async updateMoney(action: string, money: number, user: User): Promise<any> {
    let newMoney;
    if (action === Action.OPENPASSBOOK) {
      newMoney = user.currentMoney - money;
    } else if (
      action == Action.NAPTIENPAYPAL ||
      action == Action.NAPTIENATM ||
      action == Action.WITHDRAWAL
    ) {
      newMoney = user.currentMoney + money;
    }
    await this.usermodel.findOneAndUpdate(
      { _id: user._id },
      { currentMoney: newMoney },
    );
  }

  async updateNewAction(
    historyaction: HistoryAction,
    user: User,
  ): Promise<void> {
    const userExisting = await this.usermodel.findOne({ _id: user._id });
    userExisting.historyaction.push(historyaction);
    userExisting.update();
    userExisting.save();
  }

  async NaptienATM(checkout: Checkout, user: User): Promise<IReponse<User>> {
    await this.updateMoney(Action.NAPTIENATM, checkout.vnd, user);
    const historyaction = new HistoryAction();
    historyaction.action = Action.NAPTIENATM;
    historyaction.createAt = new Date();
    historyaction.money = checkout.vnd;
    await this.updateNewAction(historyaction, user);
    const message = `Bạn vừa nạp tiền vào thành công vào tài khoản với số tiền là ${historyaction.money} VND`;
    await this.mailservice.sendEmail(
      user.email,
      MailAction.MN,
      '',
      user.fullName,
      message,
    );
    return {
      code: 200,
      success: true,
      message: 'Nạp tiền thành công',
    };
  }

  async getAllTransaction(user: User): Promise<[HistoryAction]> {
    const result = await this.usermodel.findOne({ _id: user._id });
    return result.historyaction;
  }

  async getUser(id): Promise<any> {
    const user = await this.usermodel.findOne({ _id: id });
    if (!user) {
      return {
        code: 500,
        success: false,
        message: 'User not existing',
      };
    }
    return {
      data: {
        firstname: user.firstName,
        lastname: user.lastName,
        fullname: user.fullName,
        money: user.currentMoney,
        address: user.address,
        phonenumnber: user.phoneNumber,
        email: user.email,
      },
    };
  }

  async updateRole(role: string, user: User): Promise<any> {
    const updateuser = await this.usermodel.findOneAndUpdate(
      { _id: user._id },
      { role: UserRole.ADMIN },
    );
  }

  async LoginAsAdministrtor({ email, password }): Promise<any> {
    const user = await this.usermodel.findOne({ email: email });
    if (
      user &&
      (await bcrypt.compare(password, user.password)) &&
      user.isEmailConfirmed
    ) {
      if (user.role == UserRole.USER) {
        throw new UnauthorizedException(
          'Đăng nhập này chỉ dành riêng cho ADMIN',
        );
      }
      let id = user._id;
      const payload = { id };
      const accessToken = await this.jwtservice.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please Check Account');
    }
  }

  async getListUser(): Promise<User[]> {
    return await this.usermodel
      .find({ isEmailConfirmed: true })
      .select('firstName lastName email address currentMoney phoneNumber role')
      .sort({ create: -1, role: -1 });
  }

  async randomotp(): Promise<string> {
    let code;
    while (true) {
      code = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
      const otp = await this.otpmodel.findOne({ code: code });
      if (!otp) {
        break;
      }
    }
    return code;
  }

  async getnewUser(): Promise<any> {
    const newuser = await this.usermodel
      .find({ isEmailConfirmed: true, role: UserRole.USER })
      .sort({ _id: -1 })
      .select('firstName lastName email phoneNumber')
      .limit(10)
      .lean();
    return {
      newuser: newuser,
    };
  }

  async login({ email, password }): Promise<any> {
    const user = await this.usermodel.findOne({ email: email });
    if (user && (await bcrypt.compare(password, user.password))) {
      let id = user._id;
      const payload = { id };
      const accessToken = await this.jwtservice.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please Check Account');
    }
  }
}
