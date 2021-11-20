export class HistoryAction{
    createAt:Date;
    action:string;
}
export enum Action {
    OPENPASSBOOK = 'openpassbook',
    NAPTIENPAYPAL = 'naptienpaypal',
    WITHDRAWAL='withdrawal', // rut tien tu so tiet kiem
    NAPTIENATM='naptienatm'
}