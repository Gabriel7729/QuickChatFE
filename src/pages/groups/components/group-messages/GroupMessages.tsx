import React, { memo, useEffect, useState } from "react";
import {
  Avatar,
  Card,
  Group,
  Text,
  Stack,
  UnstyledButton,
  Box,
  ScrollArea,
  Textarea,
  ActionIcon,
  TextInput,
  Flex,
  Tooltip,
  rem,
} from "@mantine/core";
import { getRandomColorHex } from "../../../../common/utils/color.utils";
import { getFirstLetter } from "../../../../common/utils/utils";
import { IconSend, IconMoodSmile, IconSearch } from "@tabler/icons-react";
import Picker from "emoji-picker-react";
import classes from "./GroupMessages.module.css";
import {
  HttpTransportType,
  HubConnectionBuilder,
} from "@microsoft/signalr";
import { getDateLabel } from "../../../../common/utils/date.utils";
import { SERVER_ROUTE } from "../../../../common/constants/serverRoute.constant";
import {
  ChatResponseDto,
  SendMessageRequest,
  SendMessageResponseDto,
} from "../../../../models/chat/chat.model";
import chatService from "../../../../services/chat/chat.service";
import { useAuthStore } from "../../../../common/store/session.store";
import { GroupMessageByDate } from "./GroupMessageByDate";

const AvatarChatLetter: React.FC<GroupMessagesProps> = memo(
  ({ chat }) => {
    const chatName = chat.groupName;
    return (
      <Avatar color={getRandomColorHex()} radius="xl">
        {getFirstLetter(chatName)}
      </Avatar>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.chat.id === nextProps.chat.id;
  }
);

const groupMessagesByDate = (
  messages: ChatMessage[]
): { [key: string]: ChatMessage[] } => {
  const groups: { [key: string]: ChatMessage[] } = {};

  messages.forEach((message) => {
    const dateLabel = getDateLabel(message.time);
    if (!groups[dateLabel]) {
      groups[dateLabel] = [];
    }
    groups[dateLabel].push(message);
  });

  return groups;
};

interface ChatMessage {
  text: string;
  time: Date;
  senderName: string;
  isUserMessage: boolean;
  type: "text" | "media";
  mediaUrl?: string;
}

interface GroupMessagesProps {
  chat: ChatResponseDto;
}

export const GroupMessages: React.FC<GroupMessagesProps> = ({ chat }) => {
  const [message, setMessage] = useState<string>("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [filterKeyword, setFilterKeyword] = useState<string>("");
  const [messages, setMessages] = useState<{
    [key: string]: ChatMessage[];
  }>({});

  const { claims } = useAuthStore();
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const formatMessages = (
    messages: SendMessageResponseDto[]
  ): ChatMessage[] => {
    return messages.map((message) => ({
      text: message.content,
      time: message.timestamp,
      senderName: chat.participants.find((p) => p.id === message.senderId)?.name || 'Unknown',
      isUserMessage: message.senderId === claims?.userId!,
      type: "text",
    }));
  };

  useEffect(() => {
    async function start() {
      try {
        const connection = new HubConnectionBuilder()
          .withUrl(`${SERVER_ROUTE}/hub/chat`, {
            skipNegotiation: true,
            transport: HttpTransportType.WebSockets,
          })
          .build();

        connection.on("ReceiveMessages", (messages) => {
          setMessages(groupMessagesByDate(formatMessages(messages)));
        });

        await connection.start();

        const request = {
          ChatId: chat.id, // Replace with actual ChatId
          ContentFilter: filterKeyword, // Optional: Provide a filter if needed
        };

        await connection.invoke("GetChatMessages", request);
      } catch (error) {
        console.log(error);
        console.log("SignalR error connecting.");
      }
    }

    start();
  }, [filterKeyword, chat.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const onEmojiClick = (event: any) => {
    setMessage(message + event.emoji);
  };

  const handleSendMessage = async () => {
    const request: SendMessageRequest = {
      chatId: chat.id,
      senderId: chat.participants[0].id,
      content: message,
    };
    await chatService.sendMessage(request);
    setMessage("");
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent newline insertion
      handleSendMessage();
    }
  };

  return (
    <Stack w={"100%"} gap={"0"}>
      <Card padding={"0"} h={"75px"} w={"100%"} bg={"#F8FAFF"} withBorder>
        <Flex align="center" justify="space-between" style={{ height: "100%" }}>
          <UnstyledButton className={classes.user}>
            <Group>
              <AvatarChatLetter chat={chat} />

              <div style={{ flex: 1 }}>
                <Text size="sm" fw={500}>
                  {chat.groupName}
                </Text>

                <Text c="dimmed" size="xs">
                  Online
                </Text>
              </div>
            </Group>
          </UnstyledButton>
          <Group>
          {showSearch && (
            <TextInput
              placeholder="Filter messages..."
              value={filterKeyword}
              onChange={(e: any) => setFilterKeyword(e.currentTarget.value)}
              style={{
                transition: "width 0.3s",
                width: showSearch ? "200px" : "0px",
                overflow: "hidden",
              }}
            />
          )}
          <UnstyledButton
            style={{ width: rem(35), height: rem(35), marginRight: rem(10) }}
            className={"action"}
            onClick={() => setShowSearch(!showSearch)}
          >
            <Tooltip label="Search..." position="right">
              <IconSearch
                color="#637381"
                style={{ padding: "5px", width: rem(35), height: rem(35) }}
                stroke={1.5}
              />
            </Tooltip>
          </UnstyledButton>
        </Group>
        </Flex>
      </Card>
      <Card h={"85.3vh"} bg={"#F0F4FA"}>
        <ScrollArea style={{ height: "100%" }} viewportRef={scrollRef}>
          <Box p="md">
            {Object.keys(messages).map((date) => (
              <GroupMessageByDate
                key={date}
                date={date}
                messages={messages[date]}
              />
            ))}
          </Box>
        </ScrollArea>
      </Card>
      <Card
        padding={"md"}
        bg={"#F8FAFF"}
        withBorder
        style={{ position: "relative" }}
      >
        <Group align="center">
          <Textarea
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.currentTarget.value)}
            onKeyDown={handleKeyDown}
            autosize
            minRows={1}
            maxRows={4}
            style={{ flex: 1, backgroundColor: "#F0F4FA" }}
          />
          <ActionIcon onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
            <IconMoodSmile size={20} />
          </ActionIcon>
          <ActionIcon onClick={handleSendMessage}>
            <IconSend size={20} />
          </ActionIcon>
        </Group>
      </Card>
      {showEmojiPicker && (
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            right: "10px",
            zIndex: 1000,
          }}
        >
          <Picker onEmojiClick={onEmojiClick} />
        </div>
      )}
    </Stack>
  );
};

export default GroupMessages;
