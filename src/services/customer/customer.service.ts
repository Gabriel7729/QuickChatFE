import { CustomerResponseDto } from "../../models/customer/customer.model";
import BaseService from "../base.service";

class CustomerService extends BaseService<CustomerResponseDto> {
  constructor() {
    super("/Customer");
  }
}

export default new CustomerService();
