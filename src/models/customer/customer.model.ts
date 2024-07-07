import { BaseResponseDto } from "../base.model";

export interface CustomerDto {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  idNumber: string;
  branchId: string;
}

export interface CustomerResponseDto extends BaseResponseDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  idNumber: string;
  branchId: string;
}
