import { ResponseListModel, ResponseModel } from "../../models/base.model";
import { ChatResponseDto, CreateGroupChatRequest, SendMessageRequest, SendMessageResponseDto, StartChatRequest } from "../../models/chat/chat.model";
import { GroupChatResponseDto, GroupResponseDto } from "../../models/chat/group.model";
import BaseService from "../base.service";

class ChatService extends BaseService<ChatResponseDto> {
  constructor() {
    super("/Chat");
  }

  public async getChatsFromUser(
    userId: string
  ): Promise<ResponseListModel<ChatResponseDto>> {
    const res = await this.api.get<ResponseListModel<ChatResponseDto>>(
      `/User/${userId}`
    );
    return res.data;
  }

  public async getGroupsInCommon(
    userId: string,
    contactId: string
  ): Promise<ResponseListModel<GroupResponseDto>> {
    const res = await this.api.get<ResponseListModel<GroupResponseDto>>(
      `/User/${userId}/Contact/${contactId}/CommonGroups`
    );
    return res.data;
  }

  public async startChat(
    request: StartChatRequest
  ): Promise<ResponseModel<ChatResponseDto>> {
    const res = await this.api.post<ResponseModel<ChatResponseDto>>(`/Start`, request);
    return res.data;
  }

  public async createGroupChat(
    request: CreateGroupChatRequest
  ): Promise<ResponseModel<GroupChatResponseDto>> {
    const res = await this.api.post<ResponseModel<GroupChatResponseDto>>(`/CreateGroup`, request);
    return res.data;
  }

  public async sendMessage(
    request: SendMessageRequest
  ): Promise<ResponseModel<SendMessageResponseDto>> {
    const res = await this.api.post<ResponseModel<SendMessageResponseDto>>(`/SendMessage`, request);
    return res.data;
  }

  public async exportChatToPdf(chatId: string): Promise<Blob> {
    const res = await this.api.post<Blob>(
      `/${chatId}/Messages/Report`,
      {},
      {
        responseType: "blob",
      }
    );
    return res.data;
  }
}

export default new ChatService();
