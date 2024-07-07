import { useState } from "react";
import {
  Center,
  Tooltip,
  UnstyledButton,
  Stack,
  rem,
  Avatar,
} from "@mantine/core";
import {
  IconMessage,
  IconMessages,
} from "@tabler/icons-react";
import classes from "./Navbar.module.css";
import { useAuthStore } from "../../common/store/session.store";
import { getFirstLetter } from "../../common/utils/utils";
import { MainRoutes } from "../../routes/dashboard-routes/main-router";
import { useNavigate } from "react-router-dom";

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
  const { claims } = useAuthStore();
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  const links = MainRoutes.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => {
        setActive(index);
        navigate(link.link); // Navigate to the specific route
      }}
    />
  ));

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

      <Center>
        <Avatar size={"50"} color="blue" radius="xl">
          {getFirstLetter(claims?.name ?? "")}
        </Avatar>
      </Center>
    </nav>
  );
}
