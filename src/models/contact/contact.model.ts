export interface ListContactsRequest {
  userId: string;
  email?: string | null;
  phoneNumber?: string | null;
}
