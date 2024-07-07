import { Box, Card, CardSection, Flex, Modal, Tabs, rem } from "@mantine/core";
import { IconLock } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserResponseDto } from "../../../models/user/user.model";
import { useDisclosure } from "@mantine/hooks";
import AddOrEditUser from "../components/AddOrEditUser";
import { UserRole } from "../../../common/enums/user.enum";
import userService from "../../../services/user/user.service";
import UserDetailSection from "../components/UserDetailSection";
import PasswordChangeForm from "../components/PasswordChangeForm";

export const UserAccount = () => {
  const iconStyle = { width: rem(18), height: rem(18) };
  const [opened, { open, close }] = useDisclosure(false);
  const [userData, setUserData] = useState<UserResponseDto | undefined>(
    undefined
  );
  const { id } = useParams();

  const fetchUser = useCallback(async () => {
    if (!userData) {
      try {
        const { value } = await userService.getUserLogged();
        setUserData(value);
      } catch (error) {
        console.log("Error fetching user data", error);
      }
    }
  }, [id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

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
                  <Tabs defaultValue="password">
                    <Tabs.List>
                      <Tabs.Tab
                        value="password"
                        leftSection={<IconLock style={iconStyle} />}
                      >
                        Contraseña
                      </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="password">
                      <PasswordChangeForm userId={userData.id} />
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

export default UserAccount;
