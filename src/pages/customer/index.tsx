import { Modal, rem, Text } from "@mantine/core";
import BaseTable from "../../components/base-table/BaseTable";
import { CustomerResponseDto } from "../../models/customer/customer.model";
import { IconCheck, IconEdit, IconListDetails, IconTrash, IconUserPlus, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../common/store/session.store";
import { TableConfig } from "../../common/types/tableConfig";
import { useCustomerPaginatedList } from "../../hooks/customer/customer.hooks";
import { formatIdNumber, formatPhoneNumber } from "../../common/utils/utils";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import customerService from "../../services/customer/customer.service";
import AddOrEditCustomer from "./components/AddOrEditCustomer";
import { useDisclosure } from "@mantine/hooks";

export const ClientsPage = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [customerToEdit, setCustomerToEdit] = useState<CustomerResponseDto | undefined>();

  const iconStyle = { width: rem(20), height: rem(20) };

  const { claims } = useAuthStore();
  const navigate = useNavigate();

  const [pageSettings, setPageSettings] = useState({
    currentPage: 1,
    pageSize: 15,
  });

  const { data, isLoading, mutate } = useCustomerPaginatedList(
    claims?.branchId!,
    pageSettings.currentPage,
    pageSettings.pageSize
  );

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPageSettings({ currentPage: newPage, pageSize: newPageSize });
  };

  const deleteCustomer = async (customer: CustomerResponseDto) => {
    try {
      notifications.show({
        id: "delete-customer",
        message: `Eliminando Cliente...`,
        color: "blue",
        loading: true,
        autoClose: false,
      });

      await customerService.delete(`/${customer.id}`);
      mutate();

      notifications.update({
        id: "delete-customer",
        message: `Cliente eliminado correctamente!`,
        color: "green",
        icon: <IconCheck />,
        loading: false,
        autoClose: true,
      });
    } catch (error) {
      notifications.update({
        id: "delete-customer",
        message: `Ha ocurrido un error eliminando el Cliente.`,
        color: "red",
        icon: <IconX />,
        loading: false,
        autoClose: true,
      });
      console.error("Ha ocurrido un error eliminando el Cliente", error);
    }
  };

  const openModalConfirmOnDeleteCustomer = async (customer: CustomerResponseDto) => {
    modals.openConfirmModal({
      size: "lg",
      title: "¿Estás seguro de que deseas eliminar este Cliente?",
      confirmProps: { color: "red" },
      children: (
        <Text size="sm">
          Al eliminar este Cliente, se eliminarán todos los datos asociados a él.
        </Text>
      ),
      labels: { confirm: "Eliminar", cancel: "Cancelar" },
      onConfirm: () => {
        deleteCustomer(customer);
      },
    });
  };

  const tableConfig: TableConfig<CustomerResponseDto> = {
    titleTable: "Clientes",
    data: {
      items: data?.value.items ?? [],
      totalRecords: data?.value.totalRecords,
      pageNumber: data?.value.pageNumber,
      pageSize: data?.value.pageSize,
      totalPages: data?.value.totalPages,
    },
    isLoading,
    filters: [],
    onClick: (customer: CustomerResponseDto) => {
      navigate(`/clientes/${customer.id}`);
    },
    headers: [
      {
        key: "idNumber",
        name: "Cédula",
        format: (customer: CustomerResponseDto) => `${formatIdNumber(customer.idNumber)}`,
      },
      {
        key: "firstName",
        name: "Nombre",
        format: (customer: CustomerResponseDto) => `${customer.firstName} ${customer.lastName}`,
      },
      {
        key: "email",
        name: "Correo",
        format: (customer: CustomerResponseDto) => `${customer.email}`,
      },
      {
        key: "phoneNumber",
        name: "Teléfono",
        format: (customer: CustomerResponseDto) => `${formatPhoneNumber(customer.phoneNumber)}`,
      },
    ],
    buttonOptions: [
      {
        type: "action",
        icon: <IconUserPlus style={iconStyle} />,
        text: "Agregar",
        show: true,
        handler: () => {
          setCustomerToEdit(undefined);
          open();
        },
      },
    ],
    actions: [
      {
        icon: <IconListDetails style={iconStyle} />,
        toolTip: "Ver detalles",
        text: "Ver detalles",
        handler: (customer: CustomerResponseDto) => {
          navigate(`/clientes/${customer.id}`);
        },
      },
      {
        icon: (
          <IconEdit
            style={{ width: rem(14), height: rem(14) }}
            color="#1565C0"
          />
        ),
        toolTip: "Editar Cliente",
        text: "Editar Cliente",
        color: "#1565C0",
        handler: (customer: CustomerResponseDto) => {
          setCustomerToEdit(customer);
          open();
        },
      },
      {
        icon: (
          <IconTrash
            style={{ width: rem(14), height: rem(14) }}
            color="red"
          />
        ),
        toolTip: "Eliminar Cliente",
        text: "Eliminar Cliente",
        color: "red",
        handler: (customer: CustomerResponseDto) => {
          openModalConfirmOnDeleteCustomer(customer);
        },
      },
    ],
  };
  return (
    <div>
      <BaseTable
        config={tableConfig}
        handlePageChange={handlePageChange}
      />
      <Modal
            opened={opened}
            onClose={close}
            size={"xl"}
            title={customerToEdit ? "Editar la información del Cliente" : "Agregar un nuevo Cliente"}
            centered
          >
            <AddOrEditCustomer
              customerToEdit={customerToEdit}
              onCustomerCreated={() => {
                close();
                mutate();
              }}
            />
          </Modal>
    </div>
  );
};

export default ClientsPage;
