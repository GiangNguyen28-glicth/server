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
const Option_service_1 = require("../Option/Option.service");
const PassBook_dto_1 = require("../PassBook/DTO/PassBook.dto");
const PassBook_service_1 = require("../PassBook/PassBook.service");
const HistoryAction_obj_1 = require("../User/DTO/HistoryAction.obj");
const User_Schema_1 = require("../User/Schema/User.Schema");
const User_service_1 = require("../User/User.service");
const common_service_1 = require("../Utils/common.service");
const Cart_schema_1 = require("./Schema/Cart.schema");
let CartService = class CartService {
    constructor(cartmodel, passbookservice, userservice, commonservice, optionservice) {
        this.cartmodel = cartmodel;
        this.passbookservice = passbookservice;
        this.userservice = userservice;
        this.commonservice = commonservice;
        this.optionservice = optionservice;
    }
    async addtoCart(cartdto, user) {
        const startDate = new Date();
        const endDate = new Date();
        const cartExisting = await this.cartmodel.findOne({ userId: user._id });
        const passbookexisting = await this.optionservice.findOption(cartdto.option);
        const valueofOption = await this.optionservice.GetValueOption(startDate, cartdto.option);
        if (!passbookexisting) {
            return { code: 500, success: false, message: "Option not exist" };
        }
        if (cartdto.deposits < 1000000) {
            return { code: 500, success: false, message: "At least 1.000.000" };
        }
        if (cartdto.deposits > user.currentMoney) {
            const tienthieu = cartdto.deposits - user.currentMoney;
            return {
                code: 500, success: false, message: `Not enough money in the account, You need ${tienthieu} VND`, money: tienthieu
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
        let totalProfit = Number(((cartdto.deposits * (valueofOption / 100)) * (cartdto.option / 12))) + cartdto.deposits;
        let profit = Number(((cartdto.deposits * (valueofOption / 100)) * (cartdto.option / 12)));
        cartdto.depositinpassbook = cartdto.deposits / cartdto.suggest;
        let profitinpassbook = profit / cartdto.suggest;
        endDate.setMonth(endDate.getMonth() + cartdto.option);
        if (cartExisting) {
            cartExisting.optionId = passbookexisting._id;
            cartExisting.totalProfit = totalProfit;
            cartExisting.startDate = startDate;
            cartExisting.endDate = endDate;
            cartExisting.option = cartdto.option;
            cartExisting.deposits = cartdto.deposits;
            cartExisting.profit = profit;
            cartExisting.suggest = cartdto.suggest;
            cartExisting.depositinpassbook = cartdto.depositinpassbook;
            cartExisting.profitinpassbook = profitinpassbook;
            cartExisting.update();
            cartExisting.save();
            return { code: 200, success: true, message: "Update cart Success", objectreponse: cartExisting
            };
        }
        const result = await this.cartmodel.create({ userId: user._id, option: cartdto.option, startDate: startDate,
            endDate: endDate, deposits: cartdto.deposits, suggest: cartdto.suggest, totalProfit: totalProfit, profit: profit,
            depositinpassbook: cartdto.depositinpassbook, profitinpassbook: cartdto.depositinpassbook });
        result.save();
        return { code: 200, success: true, message: "Add to cart Success", objectreponse: result
        };
    }
    async newSuggest(quantity, user) {
        const cartExisting = await this.cartmodel.findOne({ userId: user._id });
        if (!cartExisting) {
            return { message: "Cart not existing", success: false };
        }
        const deposit = cartExisting.deposits / quantity;
        if (deposit < 1000000) {
            return { message: "Deposits not ok", success: false };
        }
        const startDate = new Date();
        const endDate = new Date();
        let totalProfit = Number(((cartExisting.deposits * (cartExisting.option / 100)) * (cartExisting.option / 12))) + cartExisting.deposits;
        let profit = Number(((cartExisting.deposits * (cartExisting.option / 100)) * (cartExisting.option / 12)));
        cartExisting.depositinpassbook = cartExisting.deposits / quantity;
        let profitinpassbook = profit / quantity;
        endDate.setMonth(endDate.getMonth() + cartExisting.option);
        if (cartExisting) {
            cartExisting.totalProfit = totalProfit;
            cartExisting.endDate = endDate;
            cartExisting.option = cartExisting.option;
            cartExisting.deposits = cartExisting.deposits;
            cartExisting.profit = profit;
            cartExisting.suggest = quantity;
            cartExisting.depositinpassbook = cartExisting.depositinpassbook;
            cartExisting.profitinpassbook = profitinpassbook;
            cartExisting.update();
            cartExisting.save();
            return { code: 200, success: true, message: "Update cart Success", objectreponse: cartExisting
            };
        }
        const result = await this.cartmodel.create({ userId: user._id, option: cartExisting.option, startDate: startDate,
            endDate: endDate, deposits: cartExisting.deposits, totalProfit: totalProfit, profit: profit });
        result.save();
        return { code: 200, success: true, message: "Add to cart Success", objectreponse: result
        };
    }
    async checkoutPassbook(user) {
        const cartExisting = await this.cartmodel.findOne({ userId: user._id });
        if (!cartExisting) {
            return {
                code: 400, success: false, message: "Cart not exist"
            };
        }
        if (user.currentMoney < cartExisting.deposits) {
            const tienthieu = cartExisting.deposits - user.currentMoney;
            return {
                code: 400, success: false, message: `Not enough money in the account, You need ${tienthieu} VND`, money: tienthieu
            };
        }
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + cartExisting.option);
        for (var i = 0; i < cartExisting.suggest; i++) {
            const svd = new PassBook_dto_1.PassBookDTO();
            svd.deposits = cartExisting.depositinpassbook;
            svd.option = cartExisting.option;
            svd.optionId = cartExisting.optionId;
            svd.userId = user._id;
            svd.createAt = new Date();
            await this.passbookservice.saveSavingsdeposit(svd, user);
        }
        const historyaction = new HistoryAction_obj_1.HistoryAction();
        historyaction.action = HistoryAction_obj_1.Action.OPENPASSBOOK;
        historyaction.createAt = new Date();
        historyaction.money = cartExisting.depositinpassbook;
        historyaction.quantity = cartExisting.suggest;
        await this.userservice.updateNewAction(historyaction, user);
        await this.userservice.updateMoney(HistoryAction_obj_1.Action.OPENPASSBOOK, cartExisting.deposits, user);
        const passpook = await this.passbookservice.GetPassbookIsActive(user);
        cartExisting.delete();
        return {
            data: user.currentMoney, passbook: passpook
        };
    }
};
CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(Cart_schema_1.Cart.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        PassBook_service_1.PassBookService,
        User_service_1.UserService,
        common_service_1.CommonService,
        Option_service_1.OptionService])
], CartService);
exports.CartService = CartService;
//# sourceMappingURL=Cart.service.js.map