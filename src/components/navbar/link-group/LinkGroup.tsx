import React, { useState } from "react";
import { Group, Box, Collapse, Text, UnstyledButton, rem } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import classes from "./NavbarLinkGroup.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { RouteConfig, RouteLink } from "../../../common/types/route.type";
import { useAuthStore } from "../../../common/store/session.store";
import { matchPath } from "../../../common/utils/route.utils";

export const LinkGroup: React.FC<RouteConfig> = ({
  icon: Icon,
  label,
  initiallyOpened,
  links,
  accessRoles,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);
  const { claims } = useAuthStore();

  const isGroupActive = links?.some((link) => matchPath(link.link, location.pathname));
  const filteredLinks = links?.filter(() =>
    accessRoles.includes(claims?.role!)
  );

  const items = (hasLinks ? filteredLinks : []).filter((link) => link.notShowInMenu !== true).map((link: RouteLink) => (
    <Text
      className={`${classes.link} ${isGroupActive ? classes.activeLink : ""}`}
      style={{ color: "white" }}
      key={link.label}
      onClick={() => {
        navigate(link.link);
      }}
    >
      {link.label}
    </Text>
  ));

  return (
    <>
      <UnstyledButton
        onClick={() => setOpened((o) => !o)}
        className={`${classes.control} ${classes.noFocusOutline} ${
          opened ? classes.openedControl : ""
        } ${isGroupActive ? classes.active : ""}`}
      >
        <Group justify="space-between" gap={0}>
          <Box style={{ display: "flex", alignItems: "center" }}>
            <Icon style={{ width: rem(18), height: rem(18) }} />
            <Box ml="md">{label}</Box>
          </Box>
          {hasLinks && (
            <IconChevronRight
              className={classes.chevron}
              stroke={1.5}
              style={{
                width: rem(16),
                height: rem(16),
                transform: opened ? "rotate(-90deg)" : "none",
                color: "white",
              }}
            />
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
};
