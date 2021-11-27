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
exports.CommonService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
let CommonService = class CommonService {
    constructor(httpService) {
        this.httpService = httpService;
    }
    async findAll() {
        const resp = await this.httpService.get("http://api.exchangeratesapi.io/v1/latest?access_key=" + process.env.access_key)
            .pipe((0, rxjs_1.map)(axiosResponse => {
            this.continueApp(axiosResponse.data.rates.USD, axiosResponse.data.rates.VND);
            return axiosResponse.data.rates;
        }));
        return resp;
    }
    async continueApp(obj1, obj2) {
        console.log(obj1);
        console.log(obj2);
    }
    convertDatetime(date) {
        var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
        var offset = date.getTimezoneOffset() / 60;
        var hours = date.getHours();
        newDate.setHours(hours - offset);
        return newDate;
    }
};
CommonService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], CommonService);
exports.CommonService = CommonService;
//# sourceMappingURL=common.service.js.map