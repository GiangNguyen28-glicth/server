import { CACHE_MANAGER, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { newOptionDTO } from './DTO/newOption.dto';
import { OptionDTO } from './DTO/Option.dto';
import { OptionObj } from './DTO/OptionObj.dto';
import { OptionDocument, Option } from './Schema/Option.chema';
@Injectable()
export class OptionService {
  constructor(
    @InjectModel(Option.name)
    private optionmodel: Model<OptionDocument>,
  ) {}

  async saveoption(option: OptionDTO): Promise<Option> {
    const result = await this.optionmodel.create(option);
    result.save();
    return result;
  }

  async findAllOption(): Promise<Option[]> {
    return await this.optionmodel.find();
  }

  async updatenewOption(id, newoptiondto: newOptionDTO): Promise<Option> {
    const optionOld = await this.optionmodel.findOne({ _id: id });
    if (!optionOld || optionOld.value == newoptiondto.value) {
      return;
    }
    let obj: OptionObj = new OptionObj();
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

  async GetValueOption(date: Date, option: number): Promise<number> {
    const result = await this.optionmodel.findOne({ option: option });
    if (!result.history.length) {
      return result.value;
    }
    if(result.history[result.history.length - 1].createAt < date&&date<result.createAt){
      return result.history[result.history.length - 1].value;
    }
    for (let i = 0; i < result.history.length - 1; i++) {
      if (result.history[i].createAt < date &&result.history[i + 1].createAt > date) {
        return result.history[i].value;
      }
    }
    return result.value
  }

  async GetValueByDateTime(time: string): Promise<any> {
    const date = new Date(time);
    date.setDate(date.getDate()+1)
    date.setMilliseconds(date.getMilliseconds()-1)
    let arr = [];
    const currentvalue = await this.optionmodel.find();
    for (var i in currentvalue) {
      if (currentvalue[i].createAt <= date) {
        arr.push({
          _id: currentvalue[i]._id,
          option: currentvalue[i].option,
          value: currentvalue[i].value,
        });
      } else {
        for (var j = 0; j < currentvalue[i].history.length; j++) {
          if (currentvalue[i].history[j].createAt >= date) {
            if (currentvalue[i].history[j - 1] != null) {
              arr.push({
                _id: currentvalue[i]._id,
                option: currentvalue[i].option,
                value: currentvalue[i].history[j - 1].value,
              });
              break;
            }
          }
          if (j == currentvalue[i].history.length - 1) {
            if (currentvalue[i].history[j].createAt <= date) {
              arr.push({
                _id: currentvalue[i]._id,
                option: currentvalue[i].option,
                value: currentvalue[i].history[j].value,
              });
            }
          }
        }
      }
    }
    return arr;
  }

  async findOption(option: number): Promise<any> {
    const result = await this.optionmodel.findOne({ option: option });
    if (!result) {
      return {
        code: '500',
        message: 'Option not found',
      };
    }
    return result;
  }

  async getCurrentValueOption(): Promise<Option[]> {
    const list = await this.optionmodel
      .find({option:{$gt:0}})
      .select('_id option value')
      .sort({ option: 1, });
    return list;
  }
}
