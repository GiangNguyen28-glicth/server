"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const Option_module_1 = require("../Option/Option.module");
const PassBook_module_1 = require("../PassBook/PassBook.module");
const User_module_1 = require("../User/User.module");
const common_service_1 = require("../Utils/common.service");
const Cart_controller_1 = require("./Cart.controller");
const Cart_service_1 = require("./Cart.service");
const Cart_schema_1 = require("./Schema/Cart.schema");
let CartModule = class CartModule {
};
CartModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: Cart_schema_1.Cart.name, schema: Cart_schema_1.CartSchema }]), User_module_1.UserModule, PassBook_module_1.PassBookModule, Option_module_1.OptionModule],
        controllers: [Cart_controller_1.CartController],
        providers: [Cart_service_1.CartService, common_service_1.CommonService],
    })
], CartModule);
exports.CartModule = CartModule;
//# sourceMappingURL=Cart.module.js.map