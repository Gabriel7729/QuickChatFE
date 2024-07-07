import { BranchResponseDto } from "../../models/branch/branch.model";
import BaseService from "../base.service";

class BranchService extends BaseService<BranchResponseDto> {
    constructor() {
        super('/Branch');
      }
}

export default new BranchService();
