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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const confirm_dto_1 = require("../Mail/confirm.dto");
const mail_service_1 = require("../Mail/mail.service");
const Option_service_1 = require("../Option/Option.service");
const PassBook_dto_1 = require("../PassBook/DTO/PassBook.dto");
const PassBook_service_1 = require("../PassBook/PassBook.service");
const HistoryAction_obj_1 = require("../User/DTO/HistoryAction.obj");
const User_Schema_1 = require("../User/Schema/User.Schema");
const User_service_1 = require("../User/User.service");
const Cart_schema_1 = require("./Schema/Cart.schema");
let CartService = class CartService {
    constructor(cartmodel, passbookservice, userservice, mailservice, optionservice) {
        this.cartmodel = cartmodel;
        this.passbookservice = passbookservice;
        this.userservice = userservice;
        this.mailservice = mailservice;
        this.optionservice = optionservice;
    }
    async addtoCart(cartdto, user) {
        const startDate = new Date(Date.now());
        const endDate = new Date(Date.now());
        const cartExisting = await this.cartmodel.findOne({ userId: user._id });
        const passbookexisting = await this.optionservice.findOption(cartdto.option);
        const valueofOption = await this.optionservice.GetValueOption(startDate, cartdto.option);
        if (!passbookexisting) {
            return { code: 500, success: false, message: 'L??i su???t kh??ng t???n t???i' };
        }
        if (cartdto.deposits < 1000000) {
            return {
                code: 500,
                success: false,
                message: 'S??? ti???n g???i ti???t ki???m ph???i l???n h??n ho???c b???ng 1.000.000 VND',
            };
        }
        if (cartdto.deposits > user.currentMoney) {
            const tienthieu = cartdto.deposits - user.currentMoney;
            return {
                code: 500,
                success: false,
                message: `B???n c???n th??m ${tienthieu} VND ????? m??? s??? ti???t ki???m`,
                money: tienthieu,
            };
        }
        if (cartdto.deposits >= 1000000 && cartdto.deposits < 2000000) {
            cartdto.suggest = 1;
        }
        else if (cartdto.deposits >= 2000000 && cartdto.deposits < 3000000) {
            cartdto.suggest = 2;
        }
        else if (cartdto.deposits >= 3000000 && cartdto.deposits < 4000000) {
            cartdto.suggest = 3;
        }
        else {
            cartdto.suggest = 4;
        }
        let totalProfit = (Number(cartdto.deposits * (valueofOption / 100) * (cartdto.option / 12)) +
            cartdto.deposits).toFixed(0);
        let profit = Number(cartdto.deposits * (valueofOption / 100) * (cartdto.option / 12));
        cartdto.depositinpassbook = cartdto.deposits / cartdto.suggest;
        let profitinpassbook = (profit / cartdto.suggest).toFixed(0);
        endDate.setMonth(endDate.getMonth() + cartdto.option);
        if (cartExisting) {
            cartExisting.optionId = passbookexisting._id;
            cartExisting.totalProfit = Number(totalProfit);
            cartExisting.startDate = startDate;
            cartExisting.endDate = endDate;
            cartExisting.option = cartdto.option;
            cartExisting.deposits = cartdto.deposits;
            cartExisting.profit = Number(profit.toFixed(0));
            cartExisting.suggest = cartdto.suggest;
            cartExisting.depositinpassbook = cartdto.depositinpassbook;
            cartExisting.profitinpassbook = Number(profitinpassbook);
            cartExisting.update();
            cartExisting.save();
            return {
                code: 200,
                success: true,
                message: 'C???p nh???t th??nh c??ng',
                objectreponse: cartExisting,
            };
        }
        const result = await this.cartmodel.create({
            userId: user._id,
            option: cartdto.option,
            optionId: passbookexisting._id,
            startDate: startDate,
            endDate: endDate,
            deposits: cartdto.deposits,
            suggest: cartdto.suggest,
            totalProfit: totalProfit,
            profit: Number(profit.toFixed(0)),
            depositinpassbook: cartdto.depositinpassbook,
            profitinpassbook: profitinpassbook,
        });
        result.save();
        result.startDate.setHours(result.startDate.getHours() + 7);
        return {
            code: 200,
            success: true,
            message: 'Th??m th??nh c??ng',
            objectreponse: result,
        };
    }
    async updateCart(quantity, user) {
        const cartExisting = await this.cartmodel.findOne({ userId: user._id });
        if (!cartExisting) {
            return { message: 'Gi??? h??ng kh??ng t???n t???i', success: false };
        }
        const deposit = cartExisting.deposits / quantity;
        if (deposit < 1000000) {
            return {
                code: 500,
                success: false,
                message: 'S??? ti???n g???i ti???t ki???m tr??n m???t g??i ph???i l???n h??n 1.000.000 VND',
            };
        }
        const startDate = new Date(Date.now());
        const endDate = new Date(Date.now());
        const valueofOption = await this.optionservice.GetValueOption(startDate, cartExisting.option);
        let totalProfit = Number(cartExisting.deposits *
            (valueofOption / 100) *
            (cartExisting.option / 12)) + cartExisting.deposits;
        let profit = Number(cartExisting.deposits *
            (valueofOption / 100) *
            (cartExisting.option / 12)).toFixed(0);
        cartExisting.depositinpassbook = cartExisting.deposits / quantity;
        let profitinpassbook = (+profit / quantity).toFixed(0);
        endDate.setMonth(endDate.getMonth() + cartExisting.option);
        if (cartExisting) {
            cartExisting.totalProfit = totalProfit;
            cartExisting.endDate = endDate;
            cartExisting.option = cartExisting.option;
            cartExisting.deposits = cartExisting.deposits;
            cartExisting.profit = Number(profit);
            cartExisting.suggest = quantity;
            cartExisting.depositinpassbook = cartExisting.depositinpassbook;
            cartExisting.profitinpassbook = Number(profitinpassbook);
            cartExisting.update();
            cartExisting.save();
            return {
                code: 200,
                success: true,
                message: 'C???p nh???t th??nh c??ng',
                objectreponse: cartExisting,
            };
        }
        const result = await this.cartmodel.create({
            userId: user._id,
            option: cartExisting.option,
            startDate: startDate,
            endDate: endDate,
            deposits: cartExisting.deposits,
            totalProfit: totalProfit,
            profit: profit,
        });
        result.save();
        return {
            code: 200,
            success: true,
            message: 'Th??m th??nh c??ng',
            objectreponse: result,
        };
    }
    async checkoutPassbook(user) {
        const cartExisting = await this.cartmodel.findOne({ userId: user._id });
        if (!cartExisting) {
            return {
                code: 500,
                success: false,
                message: 'Gi??? h??ng kh??ng t???n t???i',
            };
        }
        if (user.currentMoney < cartExisting.deposits) {
            const tienthieu = cartExisting.deposits - user.currentMoney;
            return {
                code: 500,
                success: false,
                message: `B???n c???n th??m ${tienthieu} VND ????? m??? s??? ti???t ki???m`,
                money: tienthieu,
            };
        }
        const endDate = new Date(Date.now());
        endDate.setMonth(endDate.getMonth() + cartExisting.option);
        for (var i = 0; i < cartExisting.suggest; i++) {
            const svd = new PassBook_dto_1.PassBookDTO();
            svd.deposits = cartExisting.depositinpassbook;
            svd.option = cartExisting.option;
            svd.optionId = cartExisting.optionId;
            svd.userId = user._id;
            svd.createAt = new Date(Date.now());
            svd.endAt = endDate;
            await this.passbookservice.saveSavingsdeposit(svd, user);
        }
        const historyaction = new HistoryAction_obj_1.HistoryAction();
        historyaction.action = HistoryAction_obj_1.Action.OPENPASSBOOK;
        historyaction.createAt = new Date(Date.now());
        historyaction.money = cartExisting.depositinpassbook;
        historyaction.quantity = cartExisting.suggest;
        await this.userservice.updateNewAction(historyaction, user);
        await this.userservice.updateMoney(HistoryAction_obj_1.Action.OPENPASSBOOK, cartExisting.deposits, user);
        const passbooks = await this.passbookservice.GetPassbookIsNotActive(user);
        const message = `B???n v???a m??? th??nh c??ng ${historyaction.quantity} s??? ti???t ki???m v???i t???ng s??? ti???n l?? ${historyaction.quantity * historyaction.money} VND`;
        await this.mailservice.sendEmail(user.email, confirm_dto_1.MailAction.MN, "", user.fullName, message);
        cartExisting.delete();
        return {
            currentMoney: (user.currentMoney - cartExisting.deposits).toFixed(0),
            passbooks: passbooks,
        };
    }
};
CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(Cart_schema_1.Cart.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        PassBook_service_1.PassBookService,
        User_service_1.UserService,
        mail_service_1.MailService,
        Option_service_1.OptionService])
], CartService);
exports.CartService = CartService;
//# sourceMappingURL=Cart.service.js.map