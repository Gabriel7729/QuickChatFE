import { useCallback, useEffect, useState } from "react";
import { Badge, Box } from "@mantine/core";
import { ActionStatus, getGradientColors } from "../../common/enums/log.enum";
import { TableConfig, TableHeaderFilter } from "../../common/types/tableConfig";
import {
  getEnumName,
  getEnumSelectOptions,
} from "../../common/utils/enum.utils";
import { LogResponseDto } from "../../models/log/log.model";
import CustomHoverCard from "../custom-hover-card/CustomHoverCard";
import { formatDate } from "../../common/utils/date.utils";
import BaseTable from "../base-table/BaseTable";
import queryString from "query-string";
import branchService from "../../services/branch/branch.service";
import { BranchResponseDto } from "../../models/branch/branch.model";
import useLogsPaginated from "../../hooks/userlogs/useLogsPaginated.hooks";

export interface LogTableProps {
  userId: string;
  userName: string;
}

const LogTable: React.FC<LogTableProps> = ({ userId, userName }) => {
  const [branchesData, setBranchesData] = useState<BranchResponseDto[]>([]);
  const [filters, setFilters] = useState("");
  const [pageSettings, setPageSettings] = useState({
    currentPage: 1,
    pageSize: 10,
  });

  const fetchBranches = useCallback(async () => {
    if (userId) {
      try {
        const { value } = await branchService.getList(`/User/${userId}`);
        setBranchesData(value);
      } catch (error) {
        console.log("Error fetching branches", error);
      }
    }
  }, [userId]);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const { data, isLoading } = useLogsPaginated(
    `userName=${userName}&${filters}`,
    pageSettings.currentPage,
    pageSettings.pageSize
  );

  const handleFilterApply = (filterObject: any) => {
    const filterQuery = queryString.stringify(filterObject);
    setFilters(filterQuery);
  };

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPageSettings({ currentPage: newPage, pageSize: newPageSize });
  };

  const filtersConfig: TableHeaderFilter[] = [
    {
      key: 1,
      name: "criteria",
      labelName: "Criterio de búsqueda",
      type: "text",
      startValue: "",
    },
    {
      key: 2,
      name: "actionStatus",
      labelName: "Estado de la acción",
      type: "select",
      options: getEnumSelectOptions(ActionStatus),
      startValue: "0",
    },
    //TODO: Uncomment when the backend is ready
    // {
    //   key: 3,
    //   name: "startDate",
    //   labelName: "Fecha de inicio",
    //   type: "date",
    //   startValue: "",
    // },
    // {
    //   key: 4,
    //   name: "endDate",
    //   labelName: "Fecha de fin",
    //   type: "date",
    //   startValue: "",
    // },
    {
      key: 5,
      name: "branchId",
      labelName: "Seleccione una sucursal",
      type: "select",
      options: branchesData?.map((branch) => ({
        value: branch.id,
        label: branch.name,
      })) as any,
      startValue: "",
    },
  ];

  const tableConfig: TableConfig<LogResponseDto> = {
    titleTable: "Actividad",
    data: {
      items: data?.value.items ?? [],
      totalRecords: data?.value.totalRecords,
      pageNumber: data?.value.pageNumber,
      pageSize: data?.value.pageSize,
      totalPages: data?.value.totalPages,
    },
    isLoading,
    filters: filtersConfig,
    headers: [
      {
        key: "message",
        name: "Acción",
      },
      {
        key: "exceptionMessage",
        name: "Excepción",
        renderComponent: (rowData: LogResponseDto) => {
          return rowData.exceptionMessage ? (
            <CustomHoverCard
              textButton="Ver Excepción"
              text={rowData.exceptionMessage}
            />
          ) : (
            <></>
          );
        },
      },
      {
        key: "actionStatus",
        name: "Estado de la acción",
        renderComponent: (rowData: LogResponseDto) => {
          const gradient = getGradientColors(rowData.actionStatus);
          return (
            <Badge size="sm" variant="gradient" gradient={gradient}>
              {getEnumName(ActionStatus, rowData.actionStatus)}
            </Badge>
          );
        },
      },
      {
        key: "createdDate",
        name: "Fecha de creación",
        renderComponent: (rowData: LogResponseDto) => {
          return (
            <Badge
              size="sm"
              variant="gradient"
              gradient={{ from: "blue", to: "cyan", deg: 90 }}
            >
              {formatDate(rowData.createdDate, "dd/MM/yyyy")}
            </Badge>
          );
        },
      },
    ],
    buttonOptions: [],
    actions: [],
  };

  return (
    <Box p={"lg"}>
      <BaseTable
        config={tableConfig}
        handlePageChange={handlePageChange}
        handleFilterChange={(dataFilter: any) => {
          handleFilterApply(dataFilter);
        }}
      />
    </Box>
  );
};

export default LogTable;
