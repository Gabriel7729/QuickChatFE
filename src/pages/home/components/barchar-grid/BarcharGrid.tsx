import React, { useState } from "react";
import { Select, Group, Paper, Text } from "@mantine/core";
import { BarChart } from "@mantine/charts";
import { DashboardDto, MonthlyOrWeeklySalesDataDto } from "../../../../models/branch/dashboard.model";

interface BarcharGridProps {
  data: DashboardDto;
}

export const BarcharGrid: React.FC<BarcharGridProps> = ({ data }) => {
  const [selectedData, setSelectedData] = useState<"monthly" | "weekly">("monthly");

  const { salesData } = data;

  const formatData = (data: MonthlyOrWeeklySalesDataDto[]) => {
    return data
      .map((salesData) => {
        const date = new Date(salesData.date);
        const label = selectedData === "monthly"
          ? `${date.toLocaleString("es-ES", { month: "long" })} ${date.getFullYear()}`
          : `${date.getDate()} ${date.toLocaleString("es-ES", { weekday: "long" })}`;
        return {
          label,
          date,
          Pacas: salesData.pacaSales,
          Ropas: salesData.itemSales,
        };
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime()); // Sort in ascending order
  };

  const salesDataFormatted = formatData(
    selectedData === "monthly" ? salesData.monthlySalesDatas : salesData.weeklySalesDatas
  );

  return (
    <Paper withBorder p="md" radius="md" shadow="sm">
      <Group justify="space-between" mb="md">
        <Text c={"#085b68"} size="xl" fw={"700"}>Ventas</Text>
        <Select
          value={selectedData}
          onChange={(value) => setSelectedData(value as "monthly" | "weekly")}
          data={[
            { value: "monthly", label: "Ventas Mensuales" },
            { value: "weekly", label: "Ventas Semanales" },
          ]}
        />
      </Group>
      <BarChart
        h={300}
        data={salesDataFormatted}
        dataKey="label"
        tooltipAnimationDuration={200}
        withLegend
        series={[
          { name: "Pacas", color: "#F18835" },
          { name: "Ropas", color: "#085b68" },
        ]}
        tickLine="y"
      />
    </Paper>
  );
};

export default BarcharGrid;
