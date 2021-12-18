import { DashBoardService } from './dashboard.service';
export declare class DashBoardController {
    private dashboardservice;
    constructor(dashboardservice: DashBoardService);
    getData(): Promise<any>;
}
