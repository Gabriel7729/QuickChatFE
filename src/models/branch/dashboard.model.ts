export interface DashboardDto {
  updateCard: UpdateCardDto;
  netRevenueCard: NetRevenueCardDto;
  monthlySalesCard: MonthlySalesCardDto;
  featuredProductSalesCard: FeaturedProductSalesCardDto;
  salesData: SalesDataDto;
  starProductCard: StarProductCardDto;
  categoryRevenueChart: CategoryRevenueChartDto;
  recentPacaInvoiceList: RecentPacaInvoiceListDto;
}

export interface UpdateCardDto {
  salesGrowthPercentage: number; // Store as number to be used directly in calculations
}

export interface NetRevenueCardDto {
  monthlyRevenue: number; // Monetary values stored as number
  monthlyRevenueChangePercentage: number; // Change percentage compared to last month
}

export interface MonthlySalesCardDto {
  monthlySales: number;
  monthlyTargetAchievementPercentage: number;
}

export interface FeaturedProductSalesCardDto {
  topSellingPacaDescription: string; // Description for the top-selling item
  topSellingPacaQuantity: number; // Quantity of the top-selling item
}

export interface SalesDataDto {
  monthlySalesDatas: MonthlyOrWeeklySalesDataDto[];
  weeklySalesDatas: MonthlyOrWeeklySalesDataDto[];
}

export interface MonthlyOrWeeklySalesDataDto {
  date: string;
  pacaSales: number;
  itemSales: number;
}

export interface StarProductCardDto {
  totalPacasSold: number;
  salesChangePercentage: number;
  topSellingPacas: PacaSalesDataDto[];
}

export interface PacaSalesDataDto {
  pacaDescription: string;
  quantitySold: number;
  salesPercentage: number;
}

export interface CategoryRevenueChartDto {
  totalSales: number;
  pacaCategoryDetails: CategoryDetail[];
  itemCategoryDetails: CategoryDetail[];
}

export interface CategoryDetail {
  categoryName: string;
  salesAmount: number;
}

export interface RecentPacaInvoiceDto {
  invoiceId: string;
  invoiceTotalAmount: number;
  mainDescription: string;
  creationDate: Date;
  invoiceCode: string;
}

export interface RecentPacaInvoiceListDto {
  invoices: RecentPacaInvoiceDto[];
}