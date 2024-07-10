import { BaseResponseDto } from "../base.model";
import { UserResponseDto } from "../user/user.model";

export interface ChatResponseDto extends BaseResponseDto {
  isGroupChat: boolean;
  groupName: string;
  participants: UserResponseDto[];
  lastMessage: string;
  lastMessageTimestamp: Date;
}

export interface StartChatRequest {
  userId: string;
  contactId: string;
}

export interface SendMessageResponseDto {
    id: string;
    content: string;
    timestamp: Date;
    senderId: string;
    senderName: string;
}

export interface SendMessageRequest {
    chatId: string;
    senderId: string;
    content: string;
}