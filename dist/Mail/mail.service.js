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
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const User_service_1 = require("../User/User.service");
const nodemailer = require("nodemailer");
let MailService = class MailService {
    constructor(userService, jwtservice) {
        this.userService = userService;
        this.jwtservice = jwtservice;
    }
    async sendEmail(email) {
        const payload = { email };
        const token = this.jwtservice.sign(payload, {
            secret: process.env.JWT_VERIFICATION_TOKEN_SECRET,
            expiresIn: `${process.env.JWT_VERIFICATION_TOKEN_EXPIRATION_TIME}s`
        });
        const url = `${process.env.EMAIL_CONFIRMATION_URL}?token=${token}`;
        const transporter = nodemailer.createTransport({
            service: "gmail",
            port: 25,
            secure: false,
            logger: true,
            debug: true,
            ignoreTLS: true,
            auth: {
                user: "shopme293@gmail.com",
                pass: "nxcyezzyxxuqvxor",
            },
        });
        await new Promise((resolve, reject) => {
            transporter.verify(function (error, success) {
                if (error) {
                    console.log(error);
                    reject(error);
                }
                else {
                    console.log("Server is ready to take our messages");
                    resolve(success);
                }
            });
        });
        const mailData = {
            from: process.env.FROM_EMAIL,
            to: email,
            subject: 'Confirm Mail ✔',
            html: `<b>Hello world?</b> <a href="${url}"> confirm Email</a>`,
        };
        await new Promise((resolve, reject) => {
            transporter.sendMail(mailData, (err, info) => {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                else {
                    console.log(info);
                    resolve(info);
                }
            });
        });
    }
    async decodeConfirmationToken(token) {
        try {
            const payload = await this.jwtservice.verify(token, {
                secret: process.env.JWT_VERIFICATION_TOKEN_SECRET,
            });
            if (typeof payload === 'object' && 'email' in payload) {
                return payload.email;
            }
            throw new common_1.BadRequestException();
        }
        catch (error) {
            if ((error === null || error === void 0 ? void 0 : error.name) === 'TokenExpiredError') {
                throw new common_1.BadRequestException('Email confirmation token expired');
            }
            console.log(error.message);
            throw new common_1.BadRequestException('Bad confirmation token');
        }
    }
    async confirmEmail(email) {
        const user = await this.userService.getByEmail(email);
        if (user.isEmailConfirmed) {
            throw new common_1.BadRequestException('Email already confirmed');
        }
        await this.userService.markEmailAsConfirmed(email);
    }
    async resendConfirmationLink(id) {
        const user = await this.userService.getByID(id);
        if (!user || user.isEmailConfirmed) {
            throw new common_1.BadRequestException('Email already confirmed');
        }
        await this.sendEmail(user.email);
    }
};
MailService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => User_service_1.UserService))),
    __metadata("design:paramtypes", [User_service_1.UserService, jwt_1.JwtService])
], MailService);
exports.MailService = MailService;
//# sourceMappingURL=mail.service.js.map