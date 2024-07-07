import React from "react";
import { Avatar, Card, Group, Text, UnstyledButton } from "@mantine/core";
import { getRandomColorHex } from "../../../../common/utils/color.utils";
import { getFirstLetter } from "../../../../common/utils/utils";
import classes from "./ChatMessages.module.css";

interface ChatMessagesProps {
  chat: any;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({ chat }) => {
  return (
    <Card padding={"0"} h={"75px"} w={"100%"} bg={"#F8FAFF"} withBorder>
      <UnstyledButton className={classes.user}>
        <Group>
          <Avatar color={getRandomColorHex()} radius="xl">
            {getFirstLetter("Gabriel")}
          </Avatar>

          <div style={{ flex: 1 }}>
            <Text size="sm" fw={500}>
              Gabriel De La Rosa
            </Text>

            <Text c="dimmed" size="xs">
              Online
            </Text>
          </div>
        </Group>
      </UnstyledButton>
    </Card>
  );
};

export default ChatMessages;
