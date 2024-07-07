import { PacaResponseDto } from "../../models/paca/paca.model";
import BaseService from "../base.service";

class PacaService extends BaseService<PacaResponseDto> {
  constructor() {
    super("/Paca");
  }
}

export default new PacaService();
