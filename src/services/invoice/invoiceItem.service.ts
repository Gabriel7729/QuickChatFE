import { InvoiceItemResponseDto } from "../../models/invoice/itemInvoice.model";
import BaseService from "../base.service";

class InvoiceItemService extends BaseService<InvoiceItemResponseDto> {
  constructor() {
    super("/Invoice/Item");
  }

  public async createInvoice(invoiceItemDto: any): Promise<Blob> {
    const res = await this.api.post<Blob>(``, invoiceItemDto, {
      responseType: "blob",
    });
    return res.data;
  }
}

export default new InvoiceItemService();
