import { Paper, Text, Flex, Avatar } from "@mantine/core";
import { IconFileDollar } from "@tabler/icons-react";
import { DashboardDto } from "../../../../models/branch/dashboard.model";
import { formatDate } from "../../../../common/utils/date.utils";
import { formatAmount } from "../../../../common/utils/amount.utils";
import { useNavigate } from "react-router-dom";

interface LastTransactionProps {
  data: DashboardDto;
}

export const LastTransactionChar: React.FC<LastTransactionProps> = ({
  data,
}) => {
  const navigate = useNavigate();

  const renderedStats = data.recentPacaInvoiceList.invoices.map((invoice) => {
    return (
      <Flex
        onClick={() =>  { navigate(`/facturas/paca/${invoice.invoiceId}`) }}
        p={"sm"}
        align={"center"}
        gap={"md"}
        justify={"space-between"}
        key={"recentInvoice" + invoice.invoiceCode}
      >
        <Flex align={"center"} gap={"md"}>
          <Avatar radius="xl" size={"lg"}>
            <IconFileDollar color="#F18835" size="1.7rem" />
          </Avatar>
          <Flex direction="column">
            <Text size="md" fw={500} c={"#102234"}>
              {invoice.mainDescription}
            </Text>
            <Text size="xs" c="dimmed">
              {formatDate(invoice.creationDate, "dd/MM/yyyy HH:mm a")}
            </Text>
          </Flex>
        </Flex>
        <Flex direction={"column"} align="flex-end">
          <Text c={"#F18835"}>{formatAmount(invoice.invoiceTotalAmount)}</Text>
          <Text c="dimmed" size="sm">
            {invoice.invoiceCode}
          </Text>
        </Flex>
      </Flex>
    );
  });

  return (
    <Paper withBorder p="md" radius="md" shadow="sm">
      <Text size="xl" fw={700} mb="lg" c={"#085b68"}>
        Últimas Facturas de Pacas
      </Text>
      <Flex direction={"column"} className="clickable">
        {renderedStats}
      </Flex>
    </Paper>
  );
};

export default LastTransactionChar;
