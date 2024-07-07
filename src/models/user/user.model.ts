import { UserRole } from "../../common/enums/user.enum";

export interface UserDto {
  name: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
}

export interface UserResponseDto {
  id: string;
  name: string;
  lastName: string;
  userName: string;
  address: string;
  idNumber: string;
  phoneNumber: string;
  email: string;
  role: UserRole;
  branchesInfo: BranchesInfoDto[];
}

export interface UserRequest {
  name: string;
  lastName: string;
  userName: string;
  address: string;
  idNumber: string;
  phoneNumber: string;
  email: string;
  role: UserRole;
}
export interface BranchesInfoDto {
  id: string;
  branchName: string;
  branchMembers: number;
}

export interface UpdateUserDto {
  id?: string;
  name: string;
  lastName: string;
  userName: string;
  address: string;
  idNumber: string;
  phoneNumber: string;
  email: string;
  role: UserRole;
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
