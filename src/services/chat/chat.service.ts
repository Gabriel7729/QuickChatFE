import { ResponseListModel, ResponseModel } from "../../models/base.model";
import { ChatResponseDto, SendMessageRequest, SendMessageResponseDto, StartChatRequest } from "../../models/chat/chat.model";
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

  public async startChat(
    request: StartChatRequest
  ): Promise<ResponseModel<ChatResponseDto>> {
    const res = await this.api.post<ResponseModel<ChatResponseDto>>(`/Start`, request);
    return res.data;
  }

  public async sendMessage(
    request: SendMessageRequest
  ): Promise<ResponseModel<SendMessageResponseDto>> {
    const res = await this.api.post<ResponseModel<SendMessageResponseDto>>(`/SendMessage`, request);
    return res.data;
  }
}

export default new ChatService();
