import { Paper, Group, SimpleGrid, Text } from "@mantine/core";
import {
  IconArrowUpRight,
  IconArrowDownRight,
  IconDiscount,
  IconReceipt,
  IconCoin,
  IconReportMoney,
} from "@tabler/icons-react";
import { DashboardDto } from "../../../../models/branch/dashboard.model";
import classes from "./StatsGrid.module.css";
import { formatAmount } from "../../../../common/utils/amount.utils";

interface StatsGridProps {
  data: DashboardDto;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ data }) => {
  const stats = [
    {
      title: "Actualización",
      icon: "reportMoney", // Icon for update card
      content: `Incremento semanal en ventas de pacas de un ${data.updateCard.salesGrowthPercentage.toFixed(2)}%`,
      diff: parseFloat((data.updateCard.salesGrowthPercentage).toFixed(2)),
    },
    {
      title: "Ingresos",
      icon: "receipt",
      content: `Total mensual: ${formatAmount(data.netRevenueCard.monthlyRevenue)}`,
      comparison: `${
        data.netRevenueCard.monthlyRevenueChangePercentage > 0 ? "+" : ""
      }${parseFloat((data.netRevenueCard.monthlyRevenueChangePercentage).toFixed(2))}% vs mes pasado`,
      diff: parseFloat((data.netRevenueCard.monthlyRevenueChangePercentage).toFixed(2)),
    },
    {
      title: "Objetivo Mensual de Ventas",
      icon: "coin", // Icon for weekly sales
      content: `${formatAmount(data.monthlySalesCard.monthlySales)}`,
      comparison: `Alcanza el ${data.monthlySalesCard.monthlyTargetAchievementPercentage}% del objetivo mensual`,
      diff: data.monthlySalesCard.monthlyTargetAchievementPercentage,
    },
    {
      title: "Ventas de Pacas Destacadas",
      icon: "discount",
      content: `${data.featuredProductSalesCard.topSellingPacaDescription}: ${data.featuredProductSalesCard.topSellingPacaQuantity} unidades vendidas`,
      diff: 0, // Assuming no difference percentage is provided
    },
  ];

  const renderedStats = stats.map((stat) => {
    const icons: { [key: string]: React.ElementType } = {
      receipt: IconReceipt,
      reportMoney: IconReportMoney,
      coin: IconCoin,
      discount: IconDiscount,
      user: IconDiscount,
    };
    const Icon = icons[stat.icon];
    const DiffIcon = stat.diff > 0 ? IconArrowUpRight : IconArrowDownRight;

    return (
      <Paper
        className="stats-grid-card"
        withBorder
        shadow="sm"
        p="md"
        radius="md"
        key={stat.title}
      >
        <Group justify="space-between">
          <Text size="xs" c="#085b68" className={classes.title}>
            {stat.title}
          </Text>
          <Icon className={classes.icon} size="1.4rem" stroke={1.5} />
        </Group>

        <Group align="flex-end" gap="xs" mt={25}>
          <Text className={classes.value}>{stat.content}</Text>
          {stat.diff !== 0 && (
            <Text
              c={stat.diff > 0 ? "teal" : "red"}
              fz="sm"
              fw={500}
              className={classes.diff}
            >
              <span>{stat.diff}%</span>
              <DiffIcon size="1rem" stroke={1.5} />
            </Text>
          )}
        </Group>

        {stat.comparison && (
          <Text fz="xs" c="dimmed" mt={7}>
            {stat.comparison}
          </Text>
        )}
      </Paper>
    );
  });

  return (
    <div className={classes.root}>
      <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }}>{renderedStats}</SimpleGrid>
    </div>
  );
};

export default StatsGrid;
