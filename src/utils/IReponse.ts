export abstract class IReponse<T>{
    code:number;
    success:boolean;
    objectreponse?:T;
    message?:string;
}