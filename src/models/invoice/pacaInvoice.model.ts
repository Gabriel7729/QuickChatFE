export interface InvoicePacaResponseDto {
  invoiceNumber: string;
  paidAmount: number;
  total: number;
  branchId: string;
  customerId: string;
  cashierId: string;
  invoicePacaDetails: InvoicePacaDetailDto[];
}

export interface InvoicePacaDetailDto {
  quantity: number;
  price: number;
  discount: number;
  pacaId: string;
  userId: string;
}
