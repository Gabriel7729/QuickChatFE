export interface InvoiceItemResponseDto {
  invoiceNumber: string;
  paidAmount: number;
  total: number;
  branchId: string;
  customerId: string;
  cashierId: string;
  invoiceItemDetails: InvoiceItemDetailDto[];
}

export interface InvoiceItemDetailDto {
  quantity: number;
  price: number;
  discount: number;
  itemId: string;
  userId: string;
}
