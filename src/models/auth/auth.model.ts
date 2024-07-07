export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  userId: string;
  name: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  isEmailValidated: boolean;
  token: string;
};