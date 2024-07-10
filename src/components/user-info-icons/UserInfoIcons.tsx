import { Avatar, Text, Group, Box } from "@mantine/core";
import { IconPhoneCall, IconAt } from "@tabler/icons-react";
import { getRandomColorHex } from "../../common/utils/color.utils";
import { formatPhoneNumber, getFirstLetter } from "../../common/utils/utils";
import classes from "./UserInfoIcons.module.css";

interface UserInfoIconsProps {
  name: string;
  email: string;
  phone: string;
}

export function UserInfoIcons({
  name,
  email,
  phone,
}: Readonly<UserInfoIconsProps>) {
  return (
    <Box mt={"xl"}>
      <Group wrap="nowrap">
        <Avatar color={getRandomColorHex()} size={85} radius="100">
          {getFirstLetter(name)}
        </Avatar>
        <div>
          <Text fz="lg" fw={500} className={classes.name}>
            {name}
          </Text>

          <Group wrap="nowrap" gap={10} mt={3}>
            <IconAt stroke={1.5} size="1rem" className={classes.icon} />
            <Text fz="xs" c="dimmed">
              {email}
            </Text>
          </Group>

          <Group wrap="nowrap" gap={10} mt={5}>
            <IconPhoneCall stroke={1.5} size="1rem" className={classes.icon} />
            <Text fz="xs" c="dimmed">
              {formatPhoneNumber(phone)}
            </Text>
          </Group>
        </div>
      </Group>
    </Box>
  );
}
