import {
  Box,
  Card,
  CardSection,
  Flex,
  Modal,
  Tabs,
  Text,
  UnstyledButton,
  rem,
} from "@mantine/core";
import {
  IconCheck,
  IconLock,
  IconLogs,
  IconSettings,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserResponseDto } from "../../../models/user/user.model";
import { useDisclosure } from "@mantine/hooks";
import AddOrEditUser from "../components/AddOrEditUser";
import { UserRole } from "../../../common/enums/user.enum";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import userService from "../../../services/user/user.service";
import LogTable from "../../../components/log/LogTable";
import UserDetailSection from "../components/UserDetailSection";

export const UserDetails = () => {
  const iconStyle = { width: rem(18), height: rem(18) };
  const [opened, { open, close }] = useDisclosure(false);
  const [userData, setUserData] = useState<UserResponseDto | undefined>(
    undefined
  );
  const { id } = useParams();

  const fetchUser = useCallback(async () => {
    if (!userData) {
      try {
        const { value } = await userService.getById(`/${id}`);
        setUserData(value);
      } catch (error) {
        console.log("Error fetching user data", error);
      }
    }
  }, [id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

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
          Al eliminar este usuario, se eliminarán todos los datos asociados a
          él.
        </Text>
      ),
      labels: { confirm: "Eliminar", cancel: "Cancelar" },
      onConfirm: () => {
        deleteUser(user);
      },
    });
  };

  return (
    <div>
      <Card style={{ height: "calc(100vh - 97px)" }}>
        <CardSection style={{ padding: "2rem" }}>
          <Flex gap={"xl"}>
            {userData && (
              <>
                <UserDetailSection
                  userData={userData}
                  openEditModal={() => {
                    userData.role = UserRole.ADMIN;
                    open();
                  }}
                />

                <Box w={"100%"}>
                  <Tabs defaultValue="logs">
                    <Tabs.List>
                      <Tabs.Tab
                        value="logs"
                        leftSection={<IconLogs style={iconStyle} />}
                      >
                        Actividad
                      </Tabs.Tab>
                      <Tabs.Tab
                        value="config"
                        leftSection={<IconSettings style={iconStyle} />}
                      >
                        Configuración
                      </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="logs">
                      {userData && (
                        <LogTable
                          userId={userData.id}
                          userName={userData.userName}
                        />
                      )}
                    </Tabs.Panel>
                    <Tabs.Panel value="config">
                      <Box p={"lg"}>
                        <Text fw={"500"} c={"#085b68"} size="xl">
                          Configuración
                        </Text>
                        <Flex mt={"xl"} gap={"md"} direction={"column"}>
                          <UnstyledButton
                            onClick={() => {
                              openModalConfirmOnrestoringUserPassword(
                                userData.id
                              );
                            }}
                            className="clickable"
                          >
                            <Flex p={"lg"} gap={"md"} align={"center"}>
                              <IconLock
                                width={"35px"}
                                height={"35px"}
                                color="#F18835"
                              />
                              <Flex gap={"xs"} direction={"column"}>
                                <Text c={"#48494E"} fw={"500"} size="16px">
                                  Restablecer contraseña
                                </Text>
                                <Text c={"#48494E"} size="14px">
                                  Si restableces la contraseña, se enviará un
                                  correo al usuario con su nueva contraseña.
                                </Text>
                              </Flex>
                            </Flex>
                          </UnstyledButton>
                          <UnstyledButton
                            onClick={() => {
                              openModalConfirmOnDeleteUser(userData);
                            }}
                            className="clickable"
                          >
                            <Flex p={"lg"} gap={"md"} align={"center"}>
                              <IconTrash
                                width={"35px"}
                                height={"35px"}
                                color="red"
                              />
                              <Flex gap={"xs"} direction={"column"}>
                                <Text c={"#48494E"} fw={"500"} size="16px">
                                  Eliminar usuario
                                </Text>
                                <Text c={"#48494E"} size="14px">
                                  Si eliminas al usuario, no podrá acceder al
                                  sistema.
                                </Text>
                              </Flex>
                            </Flex>
                          </UnstyledButton>
                        </Flex>
                      </Box>
                    </Tabs.Panel>
                  </Tabs>
                </Box>
              </>
            )}
          </Flex>
          <Modal
            opened={opened}
            onClose={close}
            size={"xl"}
            centered
            title={
              userData
                ? "Editar la información del usuario"
                : "Agregar un nuevo usuario"
            }
          >
            <AddOrEditUser
              userToEdit={userData}
              isUserRoleAdmin={true}
              onUserCreated={() => {
                close();
              }}
            />
          </Modal>
        </CardSection>
      </Card>
    </div>
  );
};

export default UserDetails;
