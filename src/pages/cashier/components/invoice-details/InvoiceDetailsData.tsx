import { Flex, Badge, Box, Divider, Grid, Table, Text } from "@mantine/core";
import { formatAmount } from "../../../../common/utils/amount.utils";
import { GetByIdInvoiceResponseDto } from "../../../../models/invoice/invoice.model";
import {
  PaymentMethod,
  getGradientColorsPaymentMethod,
} from "../../../../common/enums/invoice.enum";
import { getEnumName } from "../../../../common/utils/enum.utils";

interface InvoiceDetailsDataProps {
  data: GetByIdInvoiceResponseDto;
  isLoading: boolean;
  productType: string;
}

const InvoiceDetailsData: React.FC<InvoiceDetailsDataProps> = ({
  data,
  isLoading,
  productType,
}) => {
  const gradientColor = getGradientColorsPaymentMethod(data.paymentMethod);

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Flex gap={"md"} align={"center"}>
        <Text size="32px" fw={"500"} c={"#F18835"}>
          {data.invoiceNumber}
        </Text>
        <Text c={"#868E96"} fw={"500"}>
          {formatAmount(data.total)}
        </Text>
        <Badge
          size="xl"
          radius={"sm"}
          variant="gradient"
          gradient={{ from: "green", to: "lime", deg: 99 }}
        >
          {productType}
        </Badge>
      </Flex>
      <Box mt={"xl"}>
        <Text size="28px" fw={"500"} c={"#085b68"}>
          Detalle
        </Text>
        <Divider my="md" />
        <Grid>
          <Grid.Col span={6}>
            <Flex gap={"xl"}>
              <Text w={"100%"} maw={"180px"} size="md" fw={"500"} c={"#868E96"}>
                Id Factura:
              </Text>
              <Text size="md" fw={"500"}>
                {data.invoiceNumber}
              </Text>
            </Flex>
            <Flex gap={"xl"} mt={"xs"}>
              <Text w={"100%"} maw={"180px"} size="md" fw={"500"} c={"#868E96"}>
                Fecha de Facturación:
              </Text>
              <Text size="md" fw={"500"}>
                {data.createdDate} - {data.createdTime}
              </Text>
            </Flex>
            <Flex gap={"xl"} mt={"xs"}>
              <Text w={"100%"} maw={"180px"} size="md" fw={"500"} c={"#868E96"}>
                Método de Pago:
              </Text>
              <Badge variant="gradient" gradient={gradientColor}>
                {getEnumName(PaymentMethod, data.paymentMethod)}
              </Badge>
            </Flex>
            <Flex gap={"xl"} mt={"xs"}>
              <Text w={"100%"} maw={"180px"} size="md" fw={"500"} c={"#868E96"}>
                Nombre de la Sucursal:
              </Text>
              <Text size="md" fw={"500"}>
                {data.branchName}
              </Text>
            </Flex>
            <Flex gap={"xl"} mt={"xs"}>
              <Text w={"100%"} maw={"180px"} size="md" fw={"500"} c={"#868E96"}>
                Dirección de la Sucursal:
              </Text>
              <Text size="md" fw={"500"}>
                {data.branchAddress}
              </Text>
            </Flex>
          </Grid.Col>
          <Grid.Col span={6}>
            <Flex gap={"xl"}>
              <Text w={"100%"} maw={"100px"} size="md" fw={"500"} c={"#868E96"}>
                Vendedor:
              </Text>
              <Text size="md" fw={"500"}>
                {data.sellerName}
              </Text>
            </Flex>
            <Flex gap={"xl"} mt={"xs"}>
              <Text w={"100%"} maw={"100px"} size="md" fw={"500"} c={"#868E96"}>
                Cajero:
              </Text>
              <Text size="md" fw={"500"}>
                {data.cashierName}
              </Text>
            </Flex>
            <Flex gap={"xl"} mt={"xs"}>
              <Text w={"100%"} maw={"100px"} size="md" fw={"500"} c={"#868E96"}>
                Cliente:
              </Text>
              <Text size="md" fw={"500"}>
                {data.clientName}
              </Text>
            </Flex>
          </Grid.Col>
        </Grid>
      </Box>
      <Box mt={"xl"}>
        <Table striped highlightOnHover withRowBorders={false}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Paca</Table.Th>
              <Table.Th>Cantidad</Table.Th>
              <Table.Th>Precio Unidad</Table.Th>
              <Table.Th>Descuento</Table.Th>
              <Table.Th>Total</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.invoiceDetails.map((element, index) => (
              <Table.Tr key={"Key" + element.productName + index}>
                <Table.Td>{element.productName}</Table.Td>
                <Table.Td>{element.productQuantity}</Table.Td>
                <Table.Td>{element.productPrice}</Table.Td>
                <Table.Td>{element.productDiscount}</Table.Td>
                <Table.Td>{element.productTotal}</Table.Td>
              </Table.Tr>
            ))}

            <Table.Tr bg={"white"}>
              <Table.Td></Table.Td>
              <Table.Td></Table.Td>
              <Table.Td></Table.Td>
              <Table.Td pt={"40px"} fw={"500"}>
                SubTotal
              </Table.Td>
              <Table.Td pt={"40px"} fw={"500"}>
                {formatAmount(data.subTotal)}
              </Table.Td>
            </Table.Tr>

            <Table.Tr bg={"white"}>
              <Table.Td></Table.Td>
              <Table.Td></Table.Td>
              <Table.Td></Table.Td>
              <Table.Td c={"#868E96"} fw={"500"}>
                Descuentos
              </Table.Td>
              <Table.Td c={"#868E96"} fw={"500"}>
                {formatAmount(data.discounts)}
              </Table.Td>
            </Table.Tr>

            <Table.Tr bg={"white"}>
              <Table.Td></Table.Td>
              <Table.Td></Table.Td>
              <Table.Td></Table.Td>
              <Table.Td c={"#868E96"} fw={"500"}>
                Monto Pagado
              </Table.Td>
              <Table.Td c={"#868E96"} fw={"500"}>
                {formatAmount(data.paidAmount)}
              </Table.Td>
            </Table.Tr>

            <Table.Tr bg={"white"}>
              <Table.Td></Table.Td>
              <Table.Td></Table.Td>
              <Table.Td></Table.Td>
              <Table.Td pt={"20px"} fw={"500"} c={"#085b68"}>
                Total
              </Table.Td>
              <Table.Td pt={"20px"} fw={"500"} c={"#085b68"}>
                {formatAmount(data.total)}
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Box>
    </>
  );
};

export default InvoiceDetailsData;
