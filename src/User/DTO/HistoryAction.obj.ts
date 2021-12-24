export class HistoryAction{
    createAt:Date;
    action:string;
    money:number;
    quantity?:number;
}
export enum Action {
    OPENPASSBOOK = 'Mở sổ tiết kiệm',
    NAPTIENPAYPAL = 'Nạp tiền',
    WITHDRAWAL='Rút tiền', // rut tien tu so tiet kiem
    NAPTIENATM='Nạp tiền'
}