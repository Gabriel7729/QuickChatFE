import { GeneralResponseModel, ResponseModel } from "../../models/base.model";
import {
  ChangePasswordDto,
  UserResponseDto,
} from "../../models/user/user.model";
import BaseService from "../base.service";

class UserService extends BaseService<UserResponseDto> {
  constructor() {
    super("/User");
  }

  public async restorePassword(
    userId: string
  ): Promise<ResponseModel<GeneralResponseModel>> {
    const res = await this.api.patch<ResponseModel<GeneralResponseModel>>(
      `/${userId}/Password/Restore`,
      {}
    );
    return res.data;
  }

  public async getUserLogged(): Promise<ResponseModel<UserResponseDto>> {
    const res = await this.api.get<ResponseModel<UserResponseDto>>(`/Logged`);
    return res.data;
  }

  public async changePassword(
    userId: string,
    request: ChangePasswordDto
  ): Promise<ResponseModel<GeneralResponseModel>> {
    const res = await this.api.patch<ResponseModel<GeneralResponseModel>>(
      `/${userId}/Password/Change`,
      request
    );
    return res.data;
  }
}

export default new UserService();
