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
exports.LocationService = void 0;
const axios_1 = require("axios");
const common_1 = require("@nestjs/common");
let LocationService = class LocationService {
    constructor() { }
    async findProvince() {
        const resp = await axios_1.default.get('https://provinces.open-api.vn/api/');
        return resp.data;
    }
    async findDistrict(code) {
        const resp = await axios_1.default.get('https://provinces.open-api.vn/api/p/' + code + '?depth=2');
        return resp.data;
    }
    async findWards(code) {
        const resp = await axios_1.default.get("https://provinces.open-api.vn/api/d/" + code + "?depth=2");
        return resp.data;
    }
};
LocationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], LocationService);
exports.LocationService = LocationService;
//# sourceMappingURL=location.service.js.map