import {
  Group,
  Avatar,
  Text,
  rem,
  Menu,
} from "@mantine/core";
import { IconDotsVertical, IconPdf } from "@tabler/icons-react";
import classes from "./UserButton.module.css";
import { getFirstLetter } from "../../common/utils/utils";
import { getRandomColorHex } from "../../common/utils/color.utils";
import { memo } from "react";

interface AvatarChatLetterProps {
  name: string;
}

const AvatarChatLetter: React.FC<AvatarChatLetterProps> = memo(
  ({ name }) => {
    return (
      <Avatar color={getRandomColorHex()} radius="xl">
        {getFirstLetter(name)}
      </Avatar>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.name === nextProps.name;
  }
);

interface UserButtonProps {
  name: string;
  message: string;
  onMenuClick?: () => void;
  onExportPdf?: () => void;
  onClick?: () => void;
}

export function UserButton({
  name,
  message,
  onMenuClick,
  onExportPdf,
  onClick,
}: Readonly<UserButtonProps>) {
  return (
    <div className={classes.user} onClick={onClick} style={{ cursor: 'pointer' }}>
      <Group>
        <AvatarChatLetter name={name} />

        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {name}
          </Text>

          <Text c="dimmed" size="xs">
            {message}
          </Text>
        </div>
        {onMenuClick && (
          <Menu
            withArrow
            width={150}
            position="bottom"
            transitionProps={{ transition: "pop" }}
            withinPortal
          >
            <Menu.Target>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onMenuClick();
                }}
                style={{ display: 'inline-flex', alignItems: 'center' }}
              >
                <IconDotsVertical
                  style={{ width: rem(16), height: rem(16), cursor: 'pointer' }}
                  stroke={1.5}
                />
              </div>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Export</Menu.Label>
              <Menu.Item
                onClick={(e) => {
                  e.stopPropagation();
                  if (onExportPdf) onExportPdf();
                }}
                leftSection={
                  <IconPdf
                    style={{ width: rem(16), height: rem(16) }}
                    stroke={1.5}
                  />
                }
              >
                Export PDF
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </Group>
    </div>
  );
}
