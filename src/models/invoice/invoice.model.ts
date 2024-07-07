import { PaymentMethod } from "../../common/enums/invoice.enum";
import { BaseResponseDto } from "../base.model";

export interface ListInvoicePaginatedResponseDto {
  id: string;
  invoiceNumber: string;
  paidAmount: number;
  subTotal: number;
  discounts: number;
  total: number;
  paymentMethod: PaymentMethod;
  cashierName: string;
  customerName: string;
  createdDate: Date;
}

export interface GetByIdInvoiceResponseDto extends BaseResponseDto {
  invoiceNumber: string;
  paidAmount: number;
  refundAmount: number;
  subTotal: number;
  discounts: number;
  total: number;
  paymentMethod: PaymentMethod;
  branchName: string;
  branchAddress: string;
  createdDate: string;
  createdTime: string;
  cashierName: string;
  sellerName: string;
  clientName: string;
  invoiceDetails: GetByIdInvoiceDetailResponseDto[];
}

export interface GetByIdInvoiceDetailResponseDto extends BaseResponseDto {
  productName: string;
  productPrice: string;
  productDiscount: string;
  productQuantity: number;
  productTotal: string;
}