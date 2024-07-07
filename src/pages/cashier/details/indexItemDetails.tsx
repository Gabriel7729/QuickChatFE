import { Flex, Text, rem } from "@mantine/core";
import { useParams } from "react-router-dom";
import { useGetInvoiceItemById } from "../../../hooks/invoice/useInvoice.hooks";
import { IconFileInvoice } from "@tabler/icons-react";
import InvoiceDetailsData from "../components/invoice-details/InvoiceDetailsData";

export const InvoiceItemDetailsPage = () => {
  const iconStyle = { width: rem(20), height: rem(20) };

  const { id } = useParams();
  const { data, isLoading } = useGetInvoiceItemById(id!);

  return (
    <div>
      <Flex gap={"2"} mb={"xs"} align={"center"}>
        <IconFileInvoice style={iconStyle} />
        <Text size="md" fw={"500"}>
          Factura
        </Text>
      </Flex>
      {data && !isLoading && (
        <InvoiceDetailsData data={data.value} isLoading={isLoading} productType="Ropa" />
      )}
    </div>
  );
};

export default InvoiceItemDetailsPage;
