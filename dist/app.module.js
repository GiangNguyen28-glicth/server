"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const nestjs_twilio_1 = require("nestjs-twilio");
const app_controller_1 = require("./app.controller");
const Cart_module_1 = require("./Cart/Cart.module");
const Option_module_1 = require("./Option/Option.module");
const PassBook_module_1 = require("./PassBook/PassBook.module");
const Paypal_module_1 = require("./Paypal/Paypal.module");
const User_module_1 = require("./User/User.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [User_module_1.UserModule, Option_module_1.OptionModule, Paypal_module_1.PaypalModule, PassBook_module_1.PassBookModule,
            Cart_module_1.CartModule, config_1.ConfigModule.forRoot({ isGlobal: true }),
            mongoose_1.MongooseModule.forRoot(process.env.DATABASE_URL),
            nestjs_twilio_1.TwilioModule.forRoot({
                accountSid: "AC6c195ae195ad3154101bdcb5a6f4a778",
                authToken: "74dfac367ba511dd8919c04a7ac480e8",
            })
        ],
        controllers: [app_controller_1.AppController],
        providers: [],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map