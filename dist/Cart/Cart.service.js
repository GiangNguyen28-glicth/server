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
const PassBook_dto_1 = require("../PassBook/DTO/PassBook.dto");
const PassBook_service_1 = require("../PassBook/PassBook.service");
const HistoryAction_obj_1 = require("../User/DTO/HistoryAction.obj");
const User_Schema_1 = require("../User/Schema/User.Schema");
const User_service_1 = require("../User/User.service");
const IReponse_1 = require("../Utils/IReponse");
const Cart_schema_1 = require("./Schema/Cart.schema");
let CartService = class CartService {
    constructor(cartmodel, passbookservice, userservice) {
        this.cartmodel = cartmodel;
        this.passbookservice = passbookservice;
        this.userservice = userservice;
    }
    async addtoCart(cartdto, user) {
        const startDate = new Date();
        const endDate = new Date();
        const cartExisting = await this.cartmodel.findOne({ userId: user._id });
        let totalProfit = Number(((cartdto.deposits * (cartdto.option / 100)) * (cartdto.option / 12))) + cartdto.deposits;
        endDate.setMonth(endDate.getMonth() + cartdto.option);
        if (cartdto.deposits > user.currentMoney) {
            return {
                code: 500,
                success: false,
                message: "Money not enough",
            };
        }
        if (cartExisting) {
            cartExisting.totalProfit = totalProfit;
            cartExisting.endDate = endDate;
            cartExisting.option = cartdto.option;
            cartExisting.deposits = cartdto.deposits;
            cartExisting.update();
            cartExisting.save();
            return {
                code: 200,
                success: true,
                message: "Update cart Success",
                objectreponse: cartExisting
            };
        }
        const result = await this.cartmodel.create({ userId: user._id, option: cartdto.option,
            endDate: endDate, deposits: cartdto.deposits, totalProfit: totalProfit });
        result.save();
        return { code: 200, success: true, message: "Add to cart Success", objectreponse: result
        };
    }
    async dividePassbook(quantity, user) {
        const cartExisting = await this.cartmodel.findOne({ userId: user._id });
        if (!cartExisting) {
            return {
                code: 400, success: false, message: "Cart not exist"
            };
        }
        if (user.currentMoney < cartExisting.deposits) {
            return {
                code: 400, success: false, message: "Not enough money in the account"
            };
        }
        const money = cartExisting.deposits / quantity;
        if (money < 100) {
            return {
                code: 500, success: false, message: "Not enough money in the account"
            };
        }
        for (var i = 0; i < quantity; i++) {
            const svd = new PassBook_dto_1.PassBookDTO();
            svd.deposits = money;
            svd.option = cartExisting.option;
            svd.userId = user._id;
            await this.passbookservice.saveSavingsdeposit(svd, user);
            const historyaction = new HistoryAction_obj_1.HistoryAction();
            historyaction.action = HistoryAction_obj_1.Action.OPENPASSBOOK;
            historyaction.createAt = new Date();
            historyaction.money = money;
            await this.userservice.updateMoney(historyaction.action, money, user);
            await this.userservice.updateNewAction(historyaction, user);
        }
        cartExisting.delete();
    }
};
CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(Cart_schema_1.Cart.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        PassBook_service_1.PassBookService,
        User_service_1.UserService])
], CartService);
exports.CartService = CartService;
//# sourceMappingURL=Cart.service.js.map