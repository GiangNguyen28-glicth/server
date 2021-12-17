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
exports.CartController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const getuser_decorators_1 = require("../decorators/getuser.decorators");
const User_Schema_1 = require("../User/Schema/User.Schema");
const Cart_service_1 = require("./Cart.service");
const Cart_dto_1 = require("./DTO/Cart.dto");
let CartController = class CartController {
    constructor(cartservice) {
        this.cartservice = cartservice;
    }
    async addtoCart(cartdto, user) {
        return this.cartservice.addtoCart(cartdto, user);
    }
    async dividePassbook(user, quantity) {
        return this.cartservice.dividePassbook(quantity, user);
    }
};
__decorate([
    (0, common_1.Post)('/addtocart'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, getuser_decorators_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Cart_dto_1.CartDTO, User_Schema_1.User]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "addtoCart", null);
__decorate([
    (0, common_1.Post)('/dividepassbook/:quantity'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __param(0, (0, getuser_decorators_1.GetUser)()),
    __param(1, (0, common_1.Param)('quantity')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_Schema_1.User, Number]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "dividePassbook", null);
CartController = __decorate([
    (0, common_1.Controller)('/cart'),
    __metadata("design:paramtypes", [Cart_service_1.CartService])
], CartController);
exports.CartController = CartController;
//# sourceMappingURL=Cart.controller.js.map