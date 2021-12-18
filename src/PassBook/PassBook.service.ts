import { CACHE_MANAGER, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { OptionService } from 'src/Option/Option.service';
import { Action } from 'src/User/DTO/HistoryAction.obj';
import { User } from 'src/User/Schema/User.Schema';
import { UserService } from 'src/User/User.service';
import { IReponse } from 'src/Utils/IReponse';
import { CacheKeyPassbook } from './DTO/cache.key.dto';
import { PassBookDTO } from './DTO/PassBook.dto';
import { PassBook, PassBookDocument } from './Schema/PassBook.Schema';
import { Cache } from 'cache-manager';
import { CyclesUpdateDTO } from './DTO/CyclesUpdateDTO';
import { CommonService } from 'src/Utils/common.service';
@Injectable()
export class PassBookService {
  constructor(
    @InjectModel(PassBook.name)
    private passbookmodel: mongoose.Model<PassBookDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectConnection() private readonly connection: mongoose.Connection,
    @Inject(forwardRef(() => UserService))
    private userservice: UserService,
    private optionservice: OptionService,
    private commonservice: CommonService,
  ) {}

  async saveSavingsdeposit(
    passbookdto: PassBookDTO,
    user: User,
  ): Promise<IReponse<PassBook>> {
    try {
      const svdp = await this.passbookmodel.create(passbookdto);
      svdp.save();
      await this.userservice.updateSvd(svdp, user);
      return { code: 200, success: true, message: 'Succes' };
    } catch (err) {
      return { code: 500, success: false, message: err.message };
    }
  }

  async getTotalCycles(passbookid, user: User): Promise<any> {
    // CacheKeyPassbook.GET_PASSBOOK_CACHE_KEY_TOTAL_PROFIT=passbookid.toString()+"PROFIT";
    // const checkCache=await this.cacheManager.get(CacheKeyPassbook.GET_PASSBOOK_CACHE_KEY_TOTAL_PROFIT);
    // if(checkCache!=undefined){
    //     return checkCache;
    // }
    var endDate = this.commonservice.convertDatetime(new Date());
    let value;
    const svd = await this.passbookmodel.findOne({
      _id: passbookid,
      userId: user._id,
    });
    if (!svd) {
      return { code: 500, success: false, message: 'Cant find Passbook in DB' };
    }
    const startDate = new Date(`${svd.createAt}`);
    let result = [];
    const startcycle = new CyclesUpdateDTO();
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
      result[i].currentMoney = money;
    }
    const diffDays = (date, otherDate) =>
      Math.ceil(Math.abs(date - otherDate) / (1000 * 60 * 60 * 24));
    const date = diffDays(endDate, result[result.length - 1].startDate);
    console.log(date);
    const nooption = await this.optionservice.GetValueOption(endDate, 0);
    console.log(nooption);
    money = money + (money * (nooption / 100) * (date - 1)) / 360;
    result[result.length - 1].endDate = endDate;
    // await this.cacheManager.set(CacheKeyPassbook.GET_PASSBOOK_CACHE_KEY_TOTAL_PROFIT,{data:result,money:money},{ ttl: 1000 });
    return {
      passbook: svd,
      cycles: result,
      money: money,
    };
  }

  async GetAllPassbookByUserId(user: User): Promise<any> {
    const passbook = await this.passbookmodel.find({ userId: user._id });
    CacheKeyPassbook.GET_PASSBOOK_CACHE_KEY_TOTAL_PASSBOOK =
      user._id.toString() + 'GET_PASSBOOK_CACHE_KEY_TOTAL_PASSBOOK';
    return passbook;
  }

  async GetPassbookIsNotActive(user: User): Promise<PassBook[]> {
    const passbook = await this.passbookmodel.find({
      userId: user._id,
      status: false,
    });
    return passbook;
  }

  async withdrawMoneyPassbook(passbookid, user: User): Promise<PassBook> {
    const passbook = await this.passbookmodel.findOne({
      _id: passbookid,
      userId: user._id,
    });
    if (!passbook) {
      console.log('Passbook not found');
      return null;
    }
    if (passbook.status) {
      console.log('Passbook is Active');
      return null;
    }
    const { data, money } = await this.getTotalCycles(passbookid, user);
    passbook.cyclesupdate = { data, money };
    passbook.status = true;
    passbook.save();
    await this.userservice.updateMoney(Action.WITHDRAWAL, money, user);
    return passbook;
  }

  async getAllPassbook(): Promise<PassBook[]> {
    return await this.passbookmodel.find().sort({ _id: -1 });
  }
}
