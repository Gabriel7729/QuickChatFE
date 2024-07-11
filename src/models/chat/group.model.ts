import { BaseResponseDto } from "../base.model";
import { UserResponseDto } from "../user/user.model";
export interface GroupResponseDto extends BaseResponseDto {
  name: string;
  totalMembers: number;
}

export interface GroupChatResponseDto extends BaseResponseDto {
  chatId: string;
  groupName: string;
  members: UserResponseDto[];
}