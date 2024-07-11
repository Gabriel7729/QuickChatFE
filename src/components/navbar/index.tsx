import { useEffect, useState } from "react";
import {
  Center,
  Tooltip,
  UnstyledButton,
  Stack,
  rem,
  Avatar,
  Text,
  Group,
  Menu,
} from "@mantine/core";
import {
  IconAlertTriangle,
  IconCheck,
  IconChevronRight,
  IconLogout,
  IconMessage,
  IconMessages,
  IconSettings,
} from "@tabler/icons-react";
import classes from "./Navbar.module.css";
import { useAuthStore } from "../../common/store/session.store";
import { getFirstLetter } from "../../common/utils/utils";
import { MainRoutes } from "../../routes/dashboard-routes/main-router";
import { useNavigate } from "react-router-dom";
import { findCurrentRoute } from "../../common/utils/route.utils";

interface NavbarLinkProps {
  icon: typeof IconMessage;
  label: string;
  active?: boolean;
  onClick?(): void;
}

function NavbarLink({
  icon: Icon,
  label,
  active,
  onClick,
}: Readonly<NavbarLinkProps>) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        onClick={onClick}
        className={classes.link}
        data-active={active || undefined}
      >
        <Icon style={{ width: rem(25), height: rem(25) }} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

export function Navbar() {
  const { claims, logout } = useAuthStore();
  const [active, setActive] = useState("chats");
  const navigate = useNavigate();

  useEffect(() => {
    const currentRoute = findCurrentRoute(MainRoutes, location.pathname);
    if (currentRoute) {
      const activeIndex = MainRoutes.find(
        (route) => route.link === currentRoute.link
      );
      setActive(activeIndex?.link.replace("/", "") ?? "");
    }
  }, [location.pathname]);

  const links = MainRoutes.map((link) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={link.link.replace("/", "") === active}
      onClick={() => {
        setActive(link.link.replace("/", ""));
        navigate(link.link); // Navigate to the specific route
      }}
    />
  ));

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className={classes.navbar}>
      <Center>
        <Avatar size={65} variant="filled" color="blue" radius="md">
          <IconMessages style={{ width: rem(35), height: rem(35) }} />
        </Avatar>
      </Center>

      <div className={classes.navbarMain}>
        <Center>
          <Stack justify="center" gap={"md"} maw={"50px"}>
            {links}
          </Stack>
        </Center>
      </div>

      <Group justify="center">
        <Menu
          withArrow
          width={300}
          position="bottom"
          transitionProps={{ transition: "pop" }}
          withinPortal
        >
          <Menu.Target>
            <Avatar
              size={"50"}
              color="blue"
              radius="xl"
              style={{ cursor: "pointer" }}
            >
              {getFirstLetter(claims?.name ?? "")}
            </Avatar>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              onClick={() => navigate("/settings")}
              rightSection={
                <IconChevronRight
                  style={{ width: rem(16), height: rem(16) }}
                  stroke={1.5}
                />
              }
            >
              <Group>
                <Avatar size={"50"} color="blue" radius="xl">
                  {getFirstLetter(claims?.name ?? "")}
                </Avatar>

                <div>
                  <Text fw={500}>
                    {claims?.name + " " + claims?.lastName}
                    {claims?.isEmailValidated ? (
                      <IconCheck
                        style={{
                          width: rem(16),
                          height: rem(16),
                          marginLeft: rem(8),
                          color: "green",
                        }}
                        stroke={1.5}
                      />
                    ) : (
                      <IconAlertTriangle
                        style={{
                          width: rem(16),
                          height: rem(16),
                          marginLeft: rem(8),
                          color: "red",
                        }}
                        stroke={1.5}
                      />
                    )}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {claims?.email ?? ""}
                  </Text>
                </div>
              </Group>
            </Menu.Item>

            <Menu.Divider />

            <Menu.Label>Settings</Menu.Label>
            <Menu.Item
              onClick={handleLogout}
              color="red"
              leftSection={
                <IconLogout
                  style={{ width: rem(16), height: rem(16) }}
                  stroke={1.5}
                />
              }
            >
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </nav>
  );
}
