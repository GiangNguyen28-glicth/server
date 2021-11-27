import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { map, Observable } from "rxjs";

@Injectable()
export class LocationService {
  constructor(private httpService: HttpService) {}

  findProvince(): Observable<any> {
    return this.httpService.get('https://provinces.open-api.vn/api/').pipe(
        map(res=>res.data)
    );
  }

  findDistrict(code): Observable<any>{
    return this.httpService.get('https://provinces.open-api.vn/api/p/'+code+'?depth=2').pipe(
        map(res=>res.data)
    );
  }

  findWards(code):Observable<any>{
    return this.httpService.get("https://provinces.open-api.vn/api/d/"+code+"?depth=2").pipe(
      map(res=>res.data)
    );
  }
}