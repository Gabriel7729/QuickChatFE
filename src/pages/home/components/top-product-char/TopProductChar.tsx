import { Paper, Text, Flex, Avatar, Box } from "@mantine/core";
import {
  IconArrowDownRight,
  IconArrowUpRight,
  IconBox,
} from "@tabler/icons-react";
import { DashboardDto } from "../../../../models/branch/dashboard.model";
import { formatNumber } from "../../../../common/utils/amount.utils";
import classes from "../stats-grid/StatsGrid.module.css";

interface LastTransactionProps {
  data: DashboardDto;
}

export const TopProductChar: React.FC<LastTransactionProps> = ({ data }) => {
  const DiffIcon =
    data.starProductCard.salesChangePercentage > 0
      ? IconArrowUpRight
      : IconArrowDownRight;

  const renderedStats = data.starProductCard.topSellingPacas.map(
    (paca, index) => {
      return (
        <Flex
          onClick={() => console.log("Clicked")}
          p={"0px 10px 10px 0px"}
          align={"center"}
          gap={"md"}
          justify={"space-between"}
          key={"recentInvoice" + index}
        >
          <Flex align={"center"} gap={"md"}>
            <Avatar radius="xl" size={"md"}>
              <IconBox color="#F18835" size="1.5rem" />
            </Avatar>
            <Text size="md" fw={500} c={"#102234"}>
              {paca.pacaDescription}
            </Text>
          </Flex>
          <Flex direction={"column"} align="flex-end">
            <Text fw={500} c={"#102234"}>
              {paca.salesPercentage.toFixed(2)}%
            </Text>
          </Flex>
        </Flex>
      );
    }
  );

  return (
    <Paper withBorder p="md" mt={"md"} radius="md" shadow="sm">
      <Text size="xl" fw={700} mb="md" c={"#085b68"}>
        Pacas más vendidas
      </Text>
      <Flex direction={"column"} mb={"xs"}>
        <Text size="md" c="dimmed" fw={"500"}>
          Total vendidas
        </Text>
        <Flex align={"center"} gap={"xs"}>
          <Text size="xl" fw={700}>
            {formatNumber(data.starProductCard.totalPacasSold)}
          </Text>
          <Text
            size="xs"
            c={data.starProductCard.salesChangePercentage > 0 ? "teal" : "red"}
            fz="sm"
            fw={500}
            className={classes.diff}
          >
            {parseFloat((data.starProductCard.salesChangePercentage).toFixed(2))}%
            <DiffIcon size="1rem" stroke={1.5} />
          </Text>
        </Flex>
      </Flex>
      <Box className="clickable">{renderedStats}</Box>
    </Paper>
  );
};

export default TopProductChar;
