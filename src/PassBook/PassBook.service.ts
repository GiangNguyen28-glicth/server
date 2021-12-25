import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { OptionService } from 'src/Option/Option.service';
import { Action } from 'src/User/DTO/HistoryAction.obj';
import { User } from 'src/User/Schema/User.Schema';
import { UserService } from 'src/User/User.service';
import { IReponse } from 'src/Utils/IReponse';
import { PassBookDTO } from './DTO/PassBook.dto';
import { PassBook, PassBookDocument } from './Schema/PassBook.Schema';
import { CyclesUpdateDTO } from './DTO/CyclesUpdateDTO';
import { UserRole } from 'src/User/DTO/user.dto';
import { MailService } from 'src/Mail/mail.service';
import { MailAction } from 'src/Mail/confirm.dto';
@Injectable()
export class PassBookService {
  constructor(
    @InjectModel(PassBook.name)
    private passbookmodel: mongoose.Model<PassBookDocument>,
    @Inject(forwardRef(() => UserService))
    private userservice: UserService,
    private optionservice: OptionService,
    private mailservice: MailService,
  ) {}

  async saveSavingsdeposit(
    passbookdto: PassBookDTO,
    user: User,
  ): Promise<IReponse<PassBook>> {
    try {
      const svdp = await this.passbookmodel.create(passbookdto);
      svdp.save();
      await this.userservice.updateSvd(svdp, user);
      return { code: 200, success: true, message: 'Thêm mới thành công !!' };
    } catch (err) {
      return { code: 500, success: false, message: err.message };
    }
  }

  async getTotalCycles(passbookid, user: User): Promise<any> {
    let endDate = new Date();
    let value;
    const diffDays = (date, otherDate) =>
    Math.ceil(Math.abs(date - otherDate) / (1000 * 60 * 60 * 24));
    const svd = await this.passbookmodel.findOne({ _id: passbookid });
    if (!svd) {
      return {
        code: 500,
        success: false,
        message: 'Sổ tiết kiệm không hợp lệ',
      };
    }
    if(svd.status){
      const t=this.getenddate(svd.cyclesupdate)
      let datetemp;
      if(this.checkDate(t.endDate,t.startDate,svd.option)){
        datetemp=0
      }else{datetemp = diffDays(t.endDate,t.startDate);datetemp=datetemp-1}
      return {passbook:svd,cycles:svd.cyclesupdate,songayle:datetemp,money:t.currentMoney};
    }
    const startDate = new Date(`${svd.createAt}`);
    let result = [];
    if (
      startDate.getFullYear() == endDate.getFullYear() &&
      startDate.getMonth() == endDate.getMonth() &&
      startDate.getDate() == endDate.getDate()
    ) {
      const startcycle = new CyclesUpdateDTO();
      startcycle.startDate = startDate;
      startcycle.endDate = endDate;
      const nooption = await this.optionservice.GetValueOption(endDate, 0);
      startcycle.value = nooption;
      startcycle.currentMoney=svd.deposits;
      result.push(startcycle);
      return {
        passbook: svd,
        cycles: result,
        songayle: 0, //so ngay le
        money: svd.deposits,
      };
    }
    while (startDate <= endDate) {
      const startcycle = new CyclesUpdateDTO();
      value = await this.optionservice.GetValueOption(startDate, svd.option);
      startcycle.startDate = new Date(startDate);
      startDate.setMonth(startDate.getMonth() + svd.option);
      startcycle.endDate = new Date(startDate);
      startcycle.value = value;
      result.push(startcycle);
    }
    let money = svd.deposits; //tien gui
    for (let i = 0; i < result.length - 1; i++) {
      money = (money * (result[i].value / 100) * svd.option) / 12 + money;
      result[i].currentMoney = Number(money.toFixed(0));
    }
    const date = diffDays(endDate, result[result.length - 1].startDate);
    if(date-1>0){
      const nooption = await this.optionservice.GetValueOption(endDate, 0);
      money = Number(
        (money + (money * (nooption / 100) * date) / 360).toFixed(0),
      );
      result[result.length - 1].endDate = endDate;
      result[result.length - 1].value = nooption;
      result[result.length-1].money=money;
    }
    else{ result.pop() }
    return {
      passbook: svd,
      cycles: result,
      songayle: date-1, //so ngay le
      money: money,
    };
  }

  async GetAllPassbookByUserId(user: User): Promise<any> {
    const passbook = await this.passbookmodel.find({ userId: user._id });
    return passbook;
  }

  async GetPassbookIsNotActive(user: User): Promise<PassBook[]> {
    const passbook = await this.passbookmodel.find({
      userId: user._id,
      status: false,
    });
    return passbook;
  }

  async withdrawMoneyPassbook(passbookid, user: User): Promise<any> {
    const passbook = await this.passbookmodel.findOne({
      _id: passbookid,
      userId: user._id,
    });
    if (!passbook) {
      return { success: false, message: 'Không Tìm Thấy Sổ Tiết Kiệm' };
    }
    if (passbook.status) {
      return { success: false, message: 'Sổ tiết kiệm đã được rút' };
    }
    const data = await this.getTotalCycles(passbookid, user);
    passbook.cyclesupdate = data.cycles;
    passbook.status = true;
    passbook.save();
    await this.userservice.updateMoney(Action.WITHDRAWAL, data.money, user);
    const message = `Bạn vừa rút thành công sổ tiết kiệm với mã số ${passbookid} số dư hiện tại ${user.currentMoney+data.money} VND`;
    await this.mailservice.sendEmail(
      user.email,
      MailAction.MN,
      '',
      user.fullName,
      message,
    );
    return {
      passbook: passbook,
      songayle: data.songayle,
      money: Number(data.money.toFixed(0)),
    };
  }

  async getAllPassbook(): Promise<PassBook[]> {
    return await this.passbookmodel.find().sort({ createAt: -1 });
  }

  async getnewPassBook(): Promise<any> {
    const newpassbook = await this.passbookmodel
      .find({ status: false })
      .sort({ createAt: -1 })
      .limit(10)
      .lean();
    return { newpassbook: newpassbook };
  }

  async getpassbookbyUser(userid): Promise<any> {
    const passbook = await this.passbookmodel
      .find({ userId: userid })
      .sort({ _id: -1 });
    return passbook;
  }

  async getInformationPassbook(passbookid, user): Promise<any> {
    let passbook;
    if (user.role == UserRole.ADMIN) {
      passbook = await this.passbookmodel.findOne({ _id: passbookid });
    } else {
      passbook = await this.passbookmodel.findOne({
        _id: passbookid,
        userId: user._id,
      });
    }
    if (!passbook) {
      return {
        success: false,
        message: 'Không tìm thấy sổ tiết kiệm tương ứng',
      };
    }
    const valueOfoption = await this.optionservice.GetValueOption(
      new Date(),
      passbook.option,
    );
    let totalProfit =
      Number(
        passbook.deposits * (valueOfoption / 100) * (passbook.option / 12),
      ) + passbook.deposits;
    const value = await this.optionservice.findOption(passbook.option);
    let profit = totalProfit - passbook.deposits;
    return {
      passbook: passbook,
      value: value.value,
      profit: Number(profit.toFixed(0)),
      totalmoney: Number(totalProfit.toFixed(0)),
    };
  }

  getenddate(array):any{
    for(let i=0;;i++){
      if(array[i]==undefined){
          return array[i-1]
      }
    }
  }

  checkDate(date1,date2,option):boolean{
    date2.setMonth(date2.getMonth()+option)
    if (
      date1.getFullYear() == date2.getFullYear() &&
      date1.getMonth() == date2.getMonth() &&
      date1.getDate() ==date2.getDate()
    ){
      date2.setMonth(date2.getMonth()-option)
      return true
    }
    date2.setMonth(date2.getMonth()-option)
    return false
  }
}
