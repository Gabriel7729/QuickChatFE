import { Flex, Text, rem } from "@mantine/core";
import { useParams } from "react-router-dom";
import { useGetInvoicePacaById } from "../../../hooks/invoice/useInvoice.hooks";
import { IconFileInvoice } from "@tabler/icons-react";
import InvoiceDetailsData from "../components/invoice-details/InvoiceDetailsData";

export const InvoicePacaDetailsPage = () => {
  const iconStyle = { width: rem(20), height: rem(20) };

  const { id } = useParams();
  const { data, isLoading } = useGetInvoicePacaById(id!);

  return (
    <div>
      <Flex gap={"2"} mb={"xs"} align={"center"}>
        <IconFileInvoice style={iconStyle} />
        <Text size="md" fw={"500"}>
          Factura
        </Text>
      </Flex>
      {data && !isLoading && (
        <InvoiceDetailsData data={data.value} isLoading={isLoading} productType="Paca" />
      )}
    </div>
  );
};

export default InvoicePacaDetailsPage;
