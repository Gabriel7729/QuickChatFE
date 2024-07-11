import {
  Avatar,
  Box,
  Button,
  Drawer,
  Menu,
  Paper,
  PasswordInput,
  Text,
  TextInput,
} from "@mantine/core";
import classes from "./Settings.module.css";
import { memo, useState } from "react";
import { useAuthStore } from "../../common/store/session.store";
import { getRandomColorHex } from "../../common/utils/color.utils";
import { getFirstLetter, formatPhoneNumber } from "../../common/utils/utils";
import { IconLock } from "@tabler/icons-react";
import PasswordChangeForm from "./components/PasswordChangeForm";

interface AvatarChatLetterProps {
  name: string;
  size: number;
  radius: number;
}

const AvatarChatLetter: React.FC<AvatarChatLetterProps> = memo(
  ({ name, size, radius }) => {
    return (
      <Avatar color={getRandomColorHex()} size={size} radius={radius} mx="auto">
        {getFirstLetter(name)}
      </Avatar>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.name === nextProps.name;
  }
);

export const SettingsPage = () => {
  const [drawerOpened, setDrawerOpened] = useState(false);
  const { claims } = useAuthStore();

  const handlePasswordChange = () => {
    // Logic to handle password change
  };

  return (
    <>
      <nav className={classes.contactList}>
        <div className={classes.section}>
          <Text fw={"500"} size={"xl"}>
            Contacts
          </Text>
        </div>

        <div className={classes.section}>
          <Box p="lg">
            <AvatarChatLetter name={claims?.name!} size={120} radius={120} />
            <Text ta="center" fz="lg" fw={500} mt="md">
              {claims?.name!} {claims?.lastName!}
            </Text>
            <Text ta="center" c="dimmed" fz="sm">
              {claims?.email} • {formatPhoneNumber(claims?.phoneNumber!)}
            </Text>
          </Box>
          <Box>
            <Text mb={"lg"} fw={"500"} size={"xl"}>
              Settings
            </Text>
            <Menu>
              <Menu.Item
                style={{
                  backgroundColor: "#F8FAFF",
                  transition: "background-color 0.3s",
                }}
                onClick={() => setDrawerOpened(true)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#E0E7FF")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#F8FAFF")
                }
                leftSection={<IconLock size={16} />}
              >
                Change Password
              </Menu.Item>
            </Menu>
          </Box>
        </div>
      </nav>
      <Drawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        position="right"
        title="Change Password"
        padding="xl"
        size="md"
      >
        <PasswordChangeForm userId={claims?.userId!} />
      </Drawer>
    </>
  );
};

export default SettingsPage;
