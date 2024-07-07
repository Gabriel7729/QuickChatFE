import { WeekDay } from "../../common/enums/weekday.enum";

export interface ItemResponseDto {
  id: string;
  name: string;
  branchId: string;
  priceConfigurations: PriceConfigurationResponseDto[];
}

export interface PriceConfigurationResponseDto {
  id: string;
  price: number;
  weekDay: WeekDay;
  itemId: string;
}
