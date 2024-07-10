import {
  UnstyledButton,
  Group,
  Avatar,
  Text,
  rem,
  Tooltip,
} from "@mantine/core";
import { IconDotsVertical } from "@tabler/icons-react";
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
  onMenuClick: () => void;
  onClick?: () => void;
}

export function UserButton({
  name,
  message,
  onMenuClick,
  onClick,
}: Readonly<UserButtonProps>) {
  return (
    <UnstyledButton className={classes.user} onClick={onClick}>
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

        <UnstyledButton className="action" onClick={onMenuClick}>
          <Tooltip
            label="Options"
            position="right"
            transitionProps={{ duration: 0 }}
          >
            <IconDotsVertical
              style={{ width: rem(14), height: rem(14) }}
              stroke={1.5}
            />
          </Tooltip>
        </UnstyledButton>
      </Group>
    </UnstyledButton>
  );
}
