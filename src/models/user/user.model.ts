import { BaseResponseDto } from "../base.model";

export interface UserDto {
  name: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
}

export interface UserResponseDto extends BaseResponseDto {
  name: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
