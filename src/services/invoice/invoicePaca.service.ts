import { InvoicePacaResponseDto } from "../../models/invoice/pacaInvoice.model";
import BaseService from "../base.service";

class InvoicePacaService extends BaseService<InvoicePacaResponseDto> {
  constructor() {
    super("/Invoice/Paca");
  }

  public async createInvoice(invoicePacaDto: any): Promise<Blob> {
    const res = await this.api.post<Blob>(``, invoicePacaDto, {
      responseType: "blob",
    });
    return res.data;
  }
}

export default new InvoicePacaService();
