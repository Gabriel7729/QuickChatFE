import apiInstance from "../../common/axios/httpClient.axios";
import { GeneralResponseModel, ResponseModel } from "../../models/base.model";
import { SendOtpDto, ValidateOtpDto } from "../../models/validation/validation.model";

class ValidationService {
    public async sendOtp(
      request: SendOtpDto
    ): Promise<ResponseModel<GeneralResponseModel>> {
      const res = await apiInstance.post<ResponseModel<GeneralResponseModel>>(
        `/Validation/Otp/Send`,
        request
      );
      return res.data;
    }

    public async validateOtp(
        request: ValidateOtpDto
      ): Promise<ResponseModel<GeneralResponseModel>> {
        const res = await apiInstance.post<ResponseModel<GeneralResponseModel>>(
          `/Validation/Otp/Validate`,
          request
        );
        return res.data;
      }
  } 
  
  export default new ValidationService();
  