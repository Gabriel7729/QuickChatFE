import { UserRequest, UserResponseDto } from "../user/user.model";

interface PerformanceIndicators {
  currentEarnings: number;
  pacasSold: number;
  clothesBilledQuantity: number;
}

interface SalesTargetProgress {
  salesGoal: number;
  salesAchieved: number;
  goalSettingMonth: string;
  progressPercentage: number;
}

interface BranchOverview {
  performanceIndicators: PerformanceIndicators;
  salesTargetProgress: SalesTargetProgress;
}

export interface BranchResponseDto {
  id: string;
  name: string;
  address: string;
  province: string;
  user: UserResponseDto | null;
  branchOverview: BranchOverview;
  userId: string | null;
  ownerName: string;
}

export interface BranchRequest {
  id: undefined | string;
  name: string;
  address: string;
  province: string;
  user: UserRequest | null;
  userId: string | null;
}
