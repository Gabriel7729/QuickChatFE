export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  branchId: string;
  userId: string;
  userName: string;
  email: string;
  role: string;
  token: string;
};
