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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailAction = exports.confirmEmail = void 0;
const class_validator_1 = require("class-validator");
class confirmEmail {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], confirmEmail.prototype, "token", void 0);
exports.confirmEmail = confirmEmail;
var MailAction;
(function (MailAction) {
    MailAction["LG"] = "LG";
    MailAction["PW"] = "PW";
    MailAction["RS"] = "RS";
    MailAction["MN"] = "MN";
})(MailAction = exports.MailAction || (exports.MailAction = {}));
//# sourceMappingURL=confirm.dto.js.map