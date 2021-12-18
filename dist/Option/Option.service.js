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
exports.OptionService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const OptionObj_dto_1 = require("./DTO/OptionObj.dto");
const Option_chema_1 = require("./Schema/Option.chema");
let OptionService = class OptionService {
    constructor(optionmodel) {
        this.optionmodel = optionmodel;
    }
    async saveoption(option) {
        const result = await this.optionmodel.create(option);
        result.save();
        return result;
    }
    async findAllOption() {
        return await this.optionmodel.find();
    }
    async updatenewOption(id, newoptiondto) {
        const optionOld = await this.optionmodel.findOne({ _id: id });
        if (!optionOld || optionOld.value == newoptiondto.value) {
            return;
        }
        let obj = new OptionObj_dto_1.OptionObj();
        let date = new Date();
        obj.createAt = date;
        obj.value = optionOld.value;
        optionOld.history.push(obj);
        optionOld.value = newoptiondto.value;
        optionOld.createAt = new Date();
        optionOld.update();
        optionOld.save();
        return optionOld;
    }
    async GetValueOption(date, option) {
        date = new Date();
        const result = await this.optionmodel.findOne({ option: option });
        if (!result.history.length || result.history[result.history.length - 1].createAt < date) {
            return result.value;
        }
        for (let i = 0; i < result.history.length - 1; i++) {
            if (result.history[i].createAt < date && result.history[i + 1].createAt > date) {
                return result.history[i].value;
            }
        }
    }
    async GetValueByDateTime(time) {
        const date = new Date(time);
        date.setDate(date.getDate() + 1);
        console.log(date);
        if (!date.getMonth()) {
            return { code: 500, success: false, message: "Thời Giang Không Hợp Lệ !!" };
        }
        let arr = [];
        const currentvalue = await this.optionmodel.find();
        for (var i in currentvalue) {
            if (currentvalue[i].createAt <= date) {
                arr.push({ _id: currentvalue[i]._id, option: currentvalue[i].option, value: currentvalue[i].value });
            }
            else {
                for (var j = 0; j < currentvalue[i].history.length; j++) {
                    if (currentvalue[i].history[j].createAt >= date) {
                        if (currentvalue[i].history[j - 1] != null) {
                            arr.push({ _id: currentvalue[i]._id, option: currentvalue[i].option, value: currentvalue[i].history[j - 1].value });
                            break;
                        }
                    }
                    if (j == currentvalue[i].history.length - 1) {
                        if (currentvalue[i].history[j].createAt <= date) {
                            arr.push({ _id: currentvalue[i]._id, option: currentvalue[i].option, value: currentvalue[i].history[j].value });
                        }
                    }
                }
            }
        }
        return arr;
    }
    async findOption(option) {
        const result = await this.optionmodel.findOne({ option: option });
        if (!result) {
            return {
                code: "500", message: "Option not found"
            };
        }
        return result;
    }
    async getCurrentValueOption() {
        const list = await this.optionmodel.find().select('_id option value');
        return list;
    }
};
OptionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(Option_chema_1.Option.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], OptionService);
exports.OptionService = OptionService;
//# sourceMappingURL=Option.service.js.map