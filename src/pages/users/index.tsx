import { Card, CardSection, Modal, Text, rem } from "@mantine/core";
import {
  IconListDetails,
  IconEdit,
  IconLock,
  IconCheck,
  IconX,
  IconTrash,
} from "@tabler/icons-react";
import { TableConfig } from "../../common/types/tableConfig";
import { UserResponseDto } from "../../models/user/user.model";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatIdNumber, formatPhoneNumber } from "../../common/utils/utils";
import { modals } from "@mantine/modals";
import userService from "../../services/user/user.service";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import AddOrEditUser from "./components/AddOrEditUser";
import { UserRole } from "../../common/enums/user.enum";
import { useUsersPaginated } from "../../hooks/users/users.hook";
import BaseTable from "../../components/base-table/BaseTable";

export const Users = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [userToEdit, setUserToEdit] = useState<UserResponseDto | undefined>(
    undefined
  );

  const navigate = useNavigate();
  const [pageSettings, setPageSettings] = useState({
    currentPage: 1,
    pageSize: 10,
  });
  const { data, mutate, isLoading } = useUsersPaginated(
    pageSettings.currentPage,
    pageSettings.pageSize
  );

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPageSettings({ currentPage: newPage, pageSize: newPageSize });
  };

  const restoreUserPassword = async (userId: string) => {
    try {
      notifications.show({
        id: "restore-password",
        message: "Restaurando contraseña del usuario...",
        color: "blue",
        loading: true,
        autoClose: false,
      });
      const response = await userService.restorePassword(userId);
      if (response.isSuccess) {
        notifications.update({
          id: "restore-password",
          message: `La contraseña del usuario ha sido restaurada exitosamente.`,
          color: "green",
          icon: <IconCheck />,
          loading: false,
          autoClose: true,
        });
      }
    } catch (error) {
      notifications.update({
        id: "restore-password",
        message: `Ha ocurrido un error restausando la contraseña del usuario.`,
        color: "red",
        icon: <IconX />,
        loading: false,
        autoClose: true,
      });
      console.log(
        "Ha ocurrido un error restausando la contraseña del usuario",
        error
      );
    }
  };

  const deleteUser = async (user: UserResponseDto) => {
    try {
      notifications.show({
        id: "delete-user",
        message: `Eliminando usuario...`,
        color: "blue",
        loading: true,
        autoClose: false,
      });

      await userService.delete(`/${user.id}`);
      mutate();

      notifications.update({
        id: "delete-user",
        message: `Usuario eliminado correctamente!`,
        color: "green",
        icon: <IconCheck />,
        loading: false,
        autoClose: true,
      });
    } catch (error) {
      notifications.update({
        id: "delete-user",
        message: `Ha ocurrido un error eliminando el usuario.`,
        color: "red",
        icon: <IconX />,
        loading: false,
        autoClose: true,
      });
      console.error("Ha ocurrido un error eliminando el usurio", error);
    }
  };

  const openModalConfirmOnrestoringUserPassword = async (userId: string) => {
    modals.openConfirmModal({
      size: "lg",
      title: "¿Deseas restaurarle la contraseña a este usuario?",
      confirmProps: { color: "#F18835", loading: false },
      children: (
        <Text size="sm">
          Al restaurar la contraseña, el usuario recibirá un correo con
          instrucciones para restablecer su contraseña.
        </Text>
      ),
      labels: { confirm: "Restaurar", cancel: "Cancelar" },
      onConfirm: () => {
        restoreUserPassword(userId);
      },
    });
  };

  const openModalConfirmOnDeleteUser = async (user: UserResponseDto) => {
    modals.openConfirmModal({
      size: "lg",
      title: "¿Estás seguro de que deseas eliminar este usuario?",
      confirmProps: { color: "red" },
      children: (
        <Text size="sm">
          Al eliminar este usuario, se eliminarán todos los datos asociados a él.
        </Text>
      ),
      labels: { confirm: "Eliminar", cancel: "Cancelar" },
      onConfirm: () => {
        deleteUser(user);
      },
    });
  };

  const tableConfig: TableConfig<UserResponseDto> = {
    titleTable: "Listado de Usuarios",
    data: {
      items: data?.value.items ?? [],
      totalRecords: data?.value.totalRecords,
      pageNumber: data?.value.pageNumber,
      pageSize: data?.value.pageSize,
      totalPages: data?.value.totalPages,
    },
    isLoading,
    filters: [],
    onClick: (user: UserResponseDto) => {
      navigate(`/usuarios/${user.id}`);
    },
    headers: [
      {
        key: "name",
        name: "Nombre",
        format: (data: UserResponseDto) => {
          return `${data.name} ${data.lastName}`;
        },
      },
      {
        key: "userName",
        name: "Nombre de usuario",
      },
      {
        key: "idNumber",
        name: "Cédula",
        format: (data: UserResponseDto) => {
          return formatIdNumber(data.idNumber);
        },
      },
      {
        key: "email",
        name: "Correo electrónico",
      },
      {
        key: "phoneNumber",
        name: "Número de teléfono",
        format: (data: UserResponseDto) => {
          return formatPhoneNumber(data.phoneNumber);
        },
      },
      {
        key: "address",
        name: "Dirección",
      },
    ],
    buttonOptions: [],
    actions: [
      {
        icon: <IconListDetails style={{ width: rem(14), height: rem(14) }} />,
        toolTip: "Ver detalles",
        text: "Ver detalles",
        handler: (rowData: UserResponseDto) => {
          navigate(`/usuarios/${rowData.id}`);
        },
      },
      {
        icon: <IconLock style={{ width: rem(14), height: rem(14) }} />,
        toolTip: "Restaurar contraseña",
        text: "Restaurar contraseña",
        color: "#FFC107",
        handler: (rowData: UserResponseDto) => {
          openModalConfirmOnrestoringUserPassword(rowData.id);
        },
      },
      {
        icon: (
          <IconEdit
            style={{ width: rem(14), height: rem(14) }}
            color="#1565C0"
          />
        ),
        toolTip: "Editar usuario",
        text: "Editar usuario",
        color: "#1565C0",
        handler: (user: UserResponseDto) => {
          user.role = UserRole.ADMIN;
          setUserToEdit(user);
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
        toolTip: "Eliminar usuario",
        text: "Eliminar usuario",
        color: "red",
        handler: (user: UserResponseDto) => {
          openModalConfirmOnDeleteUser(user);
        },
      },
    ],
  };
  return (
    <div>
      <Card style={{ height: "calc(100vh - 97px)" }}>
        <CardSection style={{ padding: "2rem" }}>
          <BaseTable config={tableConfig} handlePageChange={handlePageChange} />
          <Modal
            opened={opened}
            onClose={close}
            size={"xl"}
            title={userToEdit ? "Editar la información del usuario" : "Agregar un nuevo usuario"}
            centered
          >
            <AddOrEditUser
              userToEdit={userToEdit}
              isUserRoleAdmin={true}
              onUserCreated={() => {
                close();
                mutate();
              }}
            />
          </Modal>
        </CardSection>
      </Card>
    </div>
  );
};

export default Users;
