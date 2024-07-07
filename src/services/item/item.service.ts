import { ItemResponseDto } from "../../models/item/item.model";
import BaseService from "../base.service";

class ItemService extends BaseService<ItemResponseDto> {
  constructor() {
    super("/Item");
  }
}

export default new ItemService();
