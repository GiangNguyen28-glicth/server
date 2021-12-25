"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassBookService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose = require("mongoose");
const Option_service_1 = require("../Option/Option.service");
const HistoryAction_obj_1 = require("../User/DTO/HistoryAction.obj");
const User_Schema_1 = require("../User/Schema/User.Schema");
const User_service_1 = require("../User/User.service");
const IReponse_1 = require("../Utils/IReponse");
const PassBook_Schema_1 = require("./Schema/PassBook.Schema");
const CyclesUpdateDTO_1 = require("./DTO/CyclesUpdateDTO");
const user_dto_1 = require("../User/DTO/user.dto");
const mail_service_1 = require("../Mail/mail.service");
const confirm_dto_1 = require("../Mail/confirm.dto");
let PassBookService = class PassBookService {
    constructor(passbookmodel, userservice, optionservice, mailservice) {
        this.passbookmodel = passbookmodel;
        this.userservice = userservice;
        this.optionservice = optionservice;
        this.mailservice = mailservice;
    }
    async saveSavingsdeposit(passbookdto, user) {
        try {
            const svdp = await this.passbookmodel.create(passbookdto);
            svdp.save();
            await this.userservice.updateSvd(svdp, user);
            return { code: 200, success: true, message: 'Thêm mới thành công !!' };
        }
        catch (err) {
            return { code: 500, success: false, message: err.message };
        }
    }
    async getTotalCycles(passbookid, user) {
        let endDate = new Date();
        let value;
        const diffDays = (date, otherDate) => Math.ceil(Math.abs(date - otherDate) / (1000 * 60 * 60 * 24));
        const svd = await this.passbookmodel.findOne({ _id: passbookid });
        if (!svd) {
            return {
                code: 500,
                success: false,
                message: 'Sổ tiết kiệm không hợp lệ',
            };
        }
        if (svd.status) {
            const t = this.getenddate(svd.cyclesupdate);
            let datetemp;
            if (this.checkDate(t.endDate, t.startDate, svd.option)) {
                datetemp = 0;
            }
            else {
                datetemp = diffDays(t.endDate, t.startDate);
                datetemp = datetemp - 1;
            }
            return { passbook: svd, cycles: svd.cyclesupdate, songayle: datetemp, money: t.money };
        }
        const startDate = new Date(`${svd.createAt}`);
        let result = [];
        if (startDate.getFullYear() == endDate.getFullYear() &&
            startDate.getMonth() == endDate.getMonth() &&
            startDate.getDate() == endDate.getDate()) {
            const startcycle = new CyclesUpdateDTO_1.CyclesUpdateDTO();
            startcycle.startDate = startDate;
            startcycle.endDate = endDate;
            const nooption = await this.optionservice.GetValueOption(endDate, 0);
            startcycle.value = nooption;
            startcycle.currentMoney = svd.deposits;
            result.push(startcycle);
            return {
                passbook: svd,
                cycles: result,
                songayle: 0,
                money: svd.deposits,
            };
        }
        while (startDate <= endDate) {
            const startcycle = new CyclesUpdateDTO_1.CyclesUpdateDTO();
            value = await this.optionservice.GetValueOption(startDate, svd.option);
            startcycle.startDate = new Date(startDate);
            startDate.setMonth(startDate.getMonth() + svd.option);
            startcycle.endDate = new Date(startDate);
            startcycle.value = value;
            result.push(startcycle);
        }
        let money = svd.deposits;
        for (let i = 0; i < result.length - 1; i++) {
            money = (money * (result[i].value / 100) * svd.option) / 12 + money;
            result[i].currentMoney = Number(money.toFixed(0));
        }
        const date = diffDays(endDate, result[result.length - 1].startDate);
        if (date - 1 > 0) {
            const nooption = await this.optionservice.GetValueOption(endDate, 0);
            money = Number((money + (money * (nooption / 100) * date) / 360).toFixed(0));
            result[result.length - 1].endDate = endDate;
            result[result.length - 1].value = nooption;
            result[result.length - 1].money = money;
        }
        else {
            result.pop();
        }
        return {
            passbook: svd,
            cycles: result,
            songayle: date - 1,
            money: money,
        };
    }
    async GetAllPassbookByUserId(user) {
        const passbook = await this.passbookmodel.find({ userId: user._id });
        return passbook;
    }
    async GetPassbookIsNotActive(user) {
        const passbook = await this.passbookmodel.find({
            userId: user._id,
            status: false,
        });
        return passbook;
    }
    async withdrawMoneyPassbook(passbookid, user) {
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
        await this.userservice.updateMoney(HistoryAction_obj_1.Action.WITHDRAWAL, data.money, user);
        const message = `Bạn vừa rút thành công sổ tiết kiệm với mã số ${passbookid} số dư hiện tại ${user.currentMoney + data.money} VND`;
        await this.mailservice.sendEmail(user.email, confirm_dto_1.MailAction.MN, '', user.fullName, message);
        return {
            passbook: passbook,
            songayle: data.songayle,
            money: Number(data.money.toFixed(0)),
        };
    }
    async getAllPassbook() {
        return await this.passbookmodel.find().sort({ createAt: -1 });
    }
    async getnewPassBook() {
        const newpassbook = await this.passbookmodel
            .find({ status: false })
            .sort({ createAt: -1 })
            .limit(10)
            .lean();
        return { newpassbook: newpassbook };
    }
    async getpassbookbyUser(userid) {
        const passbook = await this.passbookmodel
            .find({ userId: userid })
            .sort({ _id: -1 });
        return passbook;
    }
    async getInformationPassbook(passbookid, user) {
        let passbook;
        if (user.role == user_dto_1.UserRole.ADMIN) {
            passbook = await this.passbookmodel.findOne({ _id: passbookid });
        }
        else {
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
        const valueOfoption = await this.optionservice.GetValueOption(new Date(), passbook.option);
        let totalProfit = Number(passbook.deposits * (valueOfoption / 100) * (passbook.option / 12)) + passbook.deposits;
        const value = await this.optionservice.findOption(passbook.option);
        let profit = totalProfit - passbook.deposits;
        return {
            passbook: passbook,
            value: value.value,
            profit: Number(profit.toFixed(0)),
            totalmoney: Number(totalProfit.toFixed(0)),
        };
    }
    getenddate(array) {
        for (let i = 0;; i++) {
            if (array[i] == undefined) {
                return array[i - 1];
            }
        }
    }
    checkDate(date1, date2, option) {
        date2.setMonth(date2.getMonth() + option);
        if (date1.getFullYear() == date2.getFullYear() &&
            date1.getMonth() == date2.getMonth() &&
            date1.getDate() == date2.getDate()) {
            date2.setMonth(date2.getMonth() - option);
            return true;
        }
        date2.setMonth(date2.getMonth() - option);
        return false;
    }
};
PassBookService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(PassBook_Schema_1.PassBook.name)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => User_service_1.UserService))),
    __metadata("design:paramtypes", [mongoose.Model, User_service_1.UserService,
        Option_service_1.OptionService,
        mail_service_1.MailService])
], PassBookService);
exports.PassBookService = PassBookService;
//# sourceMappingURL=PassBook.service.js.map