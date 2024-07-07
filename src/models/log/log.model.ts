import { ActionStatus } from "../../common/enums/log.enum";

export interface LogResponseDto {
    id: string;
    userName: string;
    message: string;
    exceptionMessage: string;
    actionStatus: ActionStatus;
    createdDate: Date;
}

export interface FilterLogQueryDto {
    criteria: string;
    userName: string;
    actionStatus: ActionStatus;
    startDate: Date;
    endDate: Date;
    branchId: string;
}