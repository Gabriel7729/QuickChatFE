import { BaseResponseDto } from "../base.model";

export interface PacaResponseDto extends BaseResponseDto {
    name: string;
    price: number;
    quantity: number;
    branchId: string;
    pacaBrandId: string;
    typeBrandPacaId: string;
}