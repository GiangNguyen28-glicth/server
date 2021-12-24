"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassBookModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const User_module_1 = require("../User/User.module");
const Option_module_1 = require("../Option/Option.module");
const PassBook_controller_1 = require("./PassBook.controller");
const PassBook_Schema_1 = require("./Schema/PassBook.Schema");
const PassBook_service_1 = require("./PassBook.service");
const common_service_1 = require("../Utils/common.service");
const mail_module_1 = require("../Mail/mail.module");
const mail_service_1 = require("../Mail/mail.service");
const jwt_1 = require("@nestjs/jwt");
let PassBookModule = class PassBookModule {
};
PassBookModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: PassBook_Schema_1.PassBook.name, schema: PassBook_Schema_1.PassBookSchema }]), (0, common_1.forwardRef)(() => mail_module_1.MailModule), jwt_1.JwtModule.register({}),
            (0, common_1.forwardRef)(() => User_module_1.UserModule), (0, common_1.forwardRef)(() => Option_module_1.OptionModule), common_1.CacheModule.register()],
        controllers: [PassBook_controller_1.PassBookController],
        providers: [PassBook_service_1.PassBookService, common_service_1.CommonService, mail_service_1.MailService],
        exports: [PassBook_service_1.PassBookService]
    })
], PassBookModule);
exports.PassBookModule = PassBookModule;
//# sourceMappingURL=PassBook.module.js.map