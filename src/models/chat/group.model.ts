import { BaseResponseDto } from "../base.model";
export interface GroupResponseDto extends BaseResponseDto {
  name: string;
  totalMembers: number;
}
