"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const passport_1 = require("@nestjs/passport");
const mail_module_1 = require("../Mail/mail.module");
const role_guard_1 = require("../decorators/role.guard");
const User_Schema_1 = require("./Schema/User.Schema");
const User_controller_1 = require("./User.controller");
const User_service_1 = require("./User.service");
const sms_schema_1 = require("./Schema/sms.schema");
const jwt_strategy_1 = require("./JWT/jwt.strategy");
const PassBook_module_1 = require("../PassBook/PassBook.module");
const common_service_1 = require("../Utils/common.service");
let UserModule = class UserModule {
};
UserModule = __decorate([
    (0, common_1.Module)({
        imports: [(0, common_1.forwardRef)(() => mail_module_1.MailModule), (0, common_1.forwardRef)(() => PassBook_module_1.PassBookModule),
            mongoose_1.MongooseModule.forFeature([{ name: User_Schema_1.User.name, schema: User_Schema_1.UserSchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: sms_schema_1.OTP.name, schema: sms_schema_1.OTPSchema }]),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.register({
                secret: 'topSecret51',
                signOptions: {
                    expiresIn: 3600,
                }
            }), common_1.CacheModule.register(), common_service_1.CommonService],
        controllers: [User_controller_1.UserController],
        providers: [User_service_1.UserService, role_guard_1.RolesGuard, jwt_strategy_1.JwtStrategy, common_service_1.CommonService],
        exports: [User_service_1.UserService, jwt_strategy_1.JwtStrategy, passport_1.PassportModule]
    })
], UserModule);
exports.UserModule = UserModule;
//# sourceMappingURL=User.module.js.map