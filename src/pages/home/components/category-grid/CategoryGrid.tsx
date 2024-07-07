import React, { useState, useEffect } from "react";
import {
  Card,
  Text,
  ColorSwatch,
  Flex,
  Box,
  Select,
  Title,
  Avatar,
  Skeleton,
} from "@mantine/core";
import { IconTrendingDown } from "@tabler/icons-react";
import { CategoryRevenueChartDto } from "../../../../models/branch/dashboard.model";
import { formatAmount } from "../../../../common/utils/amount.utils";
import { DonutChart } from "@mantine/charts";

// Utility functions
const generateDistinctColors = (count: number) => {
  let colors = [];
  let lastHue = Math.random() * 360;
  for (let i = 0; i < count; i++) {
    lastHue = (lastHue + (360 / count) * (0.5 + Math.random() * 0.5)) % 360;
    const color = `hsl(${lastHue}, 70%, 60%)`;
    colors.push(color);
  }
  return colors;
};

interface CategoryGridProps {
  category: CategoryRevenueChartDto;
  isLoading: boolean;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ category, isLoading }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Paca");
  const [sections, setSections] = useState<
    Array<{ value: number; color: string; name: string }>
  >([]);
  const [totalSales, setTotalSales] = useState<number>(0);

  useEffect(() => {
    const selectedDetails =
      selectedCategory === "Paca"
        ? category.pacaCategoryDetails
        : category.itemCategoryDetails;

    const totalSales = category.totalSales;
    setTotalSales(totalSales);

    const colors = generateDistinctColors(selectedDetails.length);
    const newSections = selectedDetails.map((detail, index) => ({
      value: parseFloat(((detail.salesAmount / totalSales) * 100).toFixed(2)),
      color: colors[index],
      name: `${detail.categoryName}`,
    }));
    setSections(newSections);
  }, [category, selectedCategory]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <Flex
          mt={"70"}
          ml={"20"}
          gap={"35"}
          align={"center"}
          direction={{ base: "column", sm: "row" }}
        >
          <Skeleton circle height={250} width={250} />
          <Flex wrap="wrap" gap={"xl"}>
            <Skeleton height={30} width={100} radius="md" />
            <Skeleton height={30} width={100} radius="md" />
            <Skeleton height={30} width={100} radius="md" />
          </Flex>
        </Flex>
      );
    } else if (sections.length !== 0) {
      const chartLabel = `${formatAmount(totalSales)}`;

      return (
        <Flex
          mt={"15"}
          gap={"35"}
          align={"center"}
          justify={"center"}
          direction={{ base: "column", sm: "row" }}
        >
          <Box>
            <DonutChart
              data={sections}
              
              chartLabel={chartLabel}
              tooltipDataSource="segment"
              thickness={22}
              mx="auto"
            />
          </Box>
          <Flex wrap="wrap" gap={"xl"}>
            {sections.map((section, index) => (
              <Flex align={"center"} key={"Color" + index} mah={"30px"}>
                <ColorSwatch radius={"2"} color={section.color} />
                <Text size="xs" ta="center" px="xs">
                  {`${section.name} - ${section.value.toFixed(2)}%`}
                </Text>
              </Flex>
            ))}
          </Flex>
        </Flex>
      );
    } else {
      return (
        <Flex mt={"30"} gap={"40"} align={"center"} justify={"center"}>
          <Avatar color="gray" style={{ width: 130, height: 130 }} radius="100">
            <IconTrendingDown style={{ width: 90, height: 90 }} />
          </Avatar>

          <Flex direction="column" align="center">
            <Title order={3}>No hay data disponible</Title>
            <Text size="xs" ta="center">
              No hay data disponible para mostrar en esta categoría.
            </Text>
          </Flex>
        </Flex>
      );
    }
  };

  return (
    <Card
      h={{ base: "auto", md: "246px" }}
      shadow="sm"
      padding="lg"
      mt={"md"}
      radius="md"
      withBorder
    >
      <Flex justify={"space-between"}>
        <Text size="md" fw="bold" c={"#085b68"}>
          Ventas por categoría
        </Text>
        <Box>
          <Select
            size="sm"
            w={200}
            placeholder="Select Category Type"
            value={selectedCategory}
            data={[
              { value: "Paca", label: "Paca" },
              { value: "Item", label: "Ropa" },
            ]}
            onChange={(event) => {
              setSelectedCategory(event!);
            }}
          />
        </Box>
      </Flex>
      {renderContent()}
    </Card>
  );
};

export default CategoryGrid;
