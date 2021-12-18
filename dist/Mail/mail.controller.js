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
exports.MailController = void 0;
const common_1 = require("@nestjs/common");
;
const getuser_decorators_1 = require("../decorators/getuser.decorators");
const User_Schema_1 = require("../User/Schema/User.Schema");
const confirm_dto_1 = require("./confirm.dto");
const mail_service_1 = require("./mail.service");
let MailController = class MailController {
    constructor(mailservice) {
        this.mailservice = mailservice;
    }
    async confirm(token, response) {
        const email = await this.mailservice.decodeConfirmationToken(token.token);
        await this.mailservice.confirmEmail(email);
        response.redirect("https://fe-next-ecommerce.vercel.app");
    }
    async resendConfirmationLink(user) {
        return await this.mailservice.resendConfirmationLink(user._id);
    }
};
__decorate([
    (0, common_1.Get)('/confirm-email'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [confirm_dto_1.confirmEmail, Object]),
    __metadata("design:returntype", Promise)
], MailController.prototype, "confirm", null);
__decorate([
    (0, common_1.Get)('/resend-confirm-email'),
    __param(0, (0, getuser_decorators_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_Schema_1.User]),
    __metadata("design:returntype", Promise)
], MailController.prototype, "resendConfirmationLink", null);
MailController = __decorate([
    (0, common_1.Controller)(''),
    __metadata("design:paramtypes", [mail_service_1.MailService])
], MailController);
exports.MailController = MailController;
//# sourceMappingURL=mail.controller.js.map