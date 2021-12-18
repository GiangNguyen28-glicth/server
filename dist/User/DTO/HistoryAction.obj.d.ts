export declare class HistoryAction {
    createAt: Date;
    action: string;
    money: number;
    quantity?: number;
}
export declare enum Action {
    OPENPASSBOOK = "openpassbook",
    NAPTIENPAYPAL = "naptienpaypal",
    WITHDRAWAL = "withdrawal",
    NAPTIENATM = "naptienatm"
}
