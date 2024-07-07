import { useNavigate } from "react-router-dom";
import { usePacaInvoicePaginated } from "../../../../hooks/invoice/useInvoice.hooks";
import { useAuthStore } from "../../../../common/store/session.store";
import { useState } from "react";
import BaseTable from "../../../../components/base-table/BaseTable";
import { ListInvoicePaginatedResponseDto } from "../../../../models/invoice/invoice.model";
import {
  TableConfig,
  TableHeaderFilter,
} from "../../../../common/types/tableConfig";
import { formatAmount } from "../../../../common/utils/amount.utils";
import { formatDate } from "../../../../common/utils/date.utils";
import { Badge, rem } from "@mantine/core";
import {
  PaymentMethod,
  getGradientColorsPaymentMethod,
} from "../../../../common/enums/invoice.enum";
import {
  getEnumName,
  getEnumSelectOptions,
} from "../../../../common/utils/enum.utils";
import { IconCubePlus, IconListDetails } from "@tabler/icons-react";
import queryString from "query-string";

export const PacaInvoiceTable = () => {
  const iconStyle = { width: rem(20), height: rem(20) };

  const { claims } = useAuthStore();
  const navigate = useNavigate();

  const [pageSettings, setPageSettings] = useState({
    currentPage: 1,
    pageSize: 15,
  });
  const [filters, setFilters] = useState("");

  const { data, isLoading } = usePacaInvoicePaginated(
    claims?.branchId!,
    filters,
    pageSettings.currentPage,
    pageSettings.pageSize
  );

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPageSettings({ currentPage: newPage, pageSize: newPageSize });
  };

  const handleFilterApply = (filterObject: any) => {
    const filterQuery = queryString.stringify(filterObject);
    setFilters(filterQuery);
  };

  const filtersConfig: TableHeaderFilter[] = [
    {
      key: 1,
      name: "invoiceNumber",
      labelName: "Número de Factura",
      type: "text",
      startValue: "",
    },
    {
      key: 2,
      name: "cashierName",
      labelName: "Nombre del Cajero",
      type: "text",
      startValue: "",
    },
    {
      key: 3,
      name: "customerName",
      labelName: "Nombre del Cliente",
      type: "text",
      startValue: "",
    },
    //TODO: Uncomment when the backend is ready
    // {
    //   key: 4,
    //   name: "startDate",
    //   labelName: "Fecha de inicio",
    //   type: "date",
    //   startValue: "",
    // },
    // {
    //   key: 5,
    //   name: "endDate",
    //   labelName: "Fecha de fin",
    //   type: "date",
    //   startValue: "",
    // },
    {
      key: 6,
      name: "paymentMethod",
      labelName: "Método de Pago",
      type: "select",
      options: getEnumSelectOptions(PaymentMethod), // Assuming PaymentMethod is an enum similar to ActionStatus
      startValue: "0",
    },
  ];

  const tableConfig: TableConfig<ListInvoicePaginatedResponseDto> = {
    titleTable: "",
    data: {
      items: data?.value.items ?? [],
      totalRecords: data?.value.totalRecords,
      pageNumber: data?.value.pageNumber,
      pageSize: data?.value.pageSize,
      totalPages: data?.value.totalPages,
    },
    isLoading,
    filters: filtersConfig,
    onClick: (invoice: ListInvoicePaginatedResponseDto) => {
      navigate(`/facturas/paca/${invoice.id}`);
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
        format: (value) => `${formatAmount(value.total)}`,
      },
      {
        key: "createdDate",
        name: "Fecha de Facturación",
        renderComponent: (value) => {
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
        renderComponent: (value) => {
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
    buttonOptions: [
      {
        type: "action",
        icon: <IconCubePlus style={iconStyle} />,
        text: "Agregar",
        show: true,
        handler: () => {
          navigate("/facturas/agregar/paca");
        },
      },
    ],
    actions: [
      {
        icon: <IconListDetails style={iconStyle} />,
        toolTip: "Ver detalles",
        text: "Ver detalles",
        handler: (invoice: ListInvoicePaginatedResponseDto) => {
          navigate(`/facturas/paca/${invoice.id}`);
        },
      },
    ],
  };
  return (
    <div>
      <BaseTable
        config={tableConfig}
        handlePageChange={handlePageChange}
        handleFilterChange={handleFilterApply}
      />
    </div>
  );
};

export default PacaInvoiceTable;
