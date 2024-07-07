import { useNavigate } from "react-router-dom";
import { IconListDetails } from "@tabler/icons-react";
import { rem, Badge, Box } from "@mantine/core";
import { formatDate } from "date-fns";
import { useState } from "react";
import {
  getGradientColorsPaymentMethod,
  PaymentMethod,
} from "../../../common/enums/invoice.enum";
import { TableConfig } from "../../../common/types/tableConfig";
import { formatAmount } from "../../../common/utils/amount.utils";
import { getEnumName } from "../../../common/utils/enum.utils";
import BaseTable from "../../../components/base-table/BaseTable";
import { ListInvoicePaginatedResponseDto } from "../../../models/invoice/invoice.model";
import { useItemInvoicePaginated } from "../../../hooks/invoice/useInvoice.hooks";
import { useAuthStore } from "../../../common/store/session.store";

interface LastInvoiceItemFromCustomerTableProps {
  id: string;
}

const LastInvoiceItemFromCustomerTable: React.FC<
  LastInvoiceItemFromCustomerTableProps
> = ({ id }) => {
  const iconStyle = { width: rem(20), height: rem(20) };

  const { claims } = useAuthStore();
  const navigate = useNavigate();

  const [pageSettings, setPageSettings] = useState({
    currentPage: 1,
    pageSize: 10,
  });

  const { data, isLoading } = useItemInvoicePaginated(
    claims?.branchId!,
    `customerId=${id}`,
    pageSettings.currentPage,
    pageSettings.pageSize
  );

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPageSettings({ currentPage: newPage, pageSize: newPageSize });
  };

  const tableConfig: TableConfig<ListInvoicePaginatedResponseDto> = {
    titleTable: "Últimas facturas de Ropas del cliente",
    data: {
      items: data?.value.items ?? [],
      totalRecords: data?.value.totalRecords,
      pageNumber: data?.value.pageNumber,
      pageSize: data?.value.pageSize,
      totalPages: data?.value.totalPages,
    },
    isLoading,
    filters: [],
    onClick: (invoice: ListInvoicePaginatedResponseDto) => {
      navigate(`/facturas/ropa/${invoice.id}`);
    },
    headers: [
      {
        key: "invoiceNumber",
        name: "Número de factura",
      },
      {
        key: "cashierName",
        name: "Cajero",
      },
      {
        key: "customerName",
        name: "Cliente",
      },
      {
        key: "total",
        name: "Total",
        format: (value: ListInvoicePaginatedResponseDto) =>
          `${formatAmount(value.total)}`,
      },
      {
        key: "createdDate",
        name: "Fecha de Facturación",
        renderComponent: (value: ListInvoicePaginatedResponseDto) => {
          return (
            <Badge
              variant="gradient"
              gradient={{ from: "blue", to: "cyan", deg: 90 }}
            >
              {formatDate(value.createdDate, "dd/MM/yyyy")}
            </Badge>
          );
        },
      },
      {
        key: "paymentMethod",
        name: "Método de pago",
        renderComponent: (value: ListInvoicePaginatedResponseDto) => {
          const gradientColor = getGradientColorsPaymentMethod(
            value.paymentMethod
          );
          return (
            <Badge variant="gradient" gradient={gradientColor}>
              {getEnumName(PaymentMethod, value.paymentMethod)}
            </Badge>
          );
        },
      },
    ],
    buttonOptions: [],
    actions: [
      {
        icon: <IconListDetails style={iconStyle} />,
        toolTip: "Ver detalles",
        text: "Ver detalles",
        handler: (invoice: ListInvoicePaginatedResponseDto) => {
          navigate(`/facturas/ropa/${invoice.id}`);
        },
      },
    ],
  };
  return (
    <Box mt={"lg"}>
      <BaseTable config={tableConfig} handlePageChange={handlePageChange} />
    </Box>
  );
};

export default LastInvoiceItemFromCustomerTable;
