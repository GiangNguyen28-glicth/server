import axios from 'axios';
import { Injectable } from "@nestjs/common";
@Injectable()
export class LocationService {
  constructor() {}

  async findProvince(): Promise<any>{
    const resp=await axios.get('https://provinces.open-api.vn/api/');
    return resp.data;
  }

  async findDistrict(code):Promise<any>{
    const resp=await axios.get('https://provinces.open-api.vn/api/p/'+code+'?depth=2');
    return resp.data;
  }

  async findWards(code):Promise<any>{
    const resp=await axios.get("https://provinces.open-api.vn/api/d/"+code+"?depth=2");
    return resp.data;
  }
}