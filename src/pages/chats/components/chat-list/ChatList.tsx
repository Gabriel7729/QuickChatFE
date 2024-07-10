import React, { useEffect, useState } from "react";
import {
  Flex,
  Group,
  Modal,
  rem,
  ScrollArea,
  Text,
  TextInput,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { IconSearch, IconPlus } from "@tabler/icons-react";
import classes from "./ChatList.module.css";
import { UserButton } from "../../../../components/user-button/UserButton";
import { ChatResponseDto } from "../../../../models/chat/chat.model";
import chatService from "../../../../services/chat/chat.service";
import { useAuthStore } from "../../../../common/store/session.store";
import AddChat from "../add-chat/AddChat";
import { useDisclosure } from "@mantine/hooks";

interface ChatListProps {
  onChatClick: (chat: ChatResponseDto) => void;
}

export const ChatList: React.FC<ChatListProps> = ({ onChatClick }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [chats, setChats] = useState<ChatResponseDto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { claims } = useAuthStore();

  const fetchChats = async () => {
    try {
      const { value } = await chatService.getChatsFromUser(claims?.userId!);
      setChats(value);
    } catch (error) {
      console.log("Error fetching Chats", error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const handleMenuClick = () => {
    console.log("Menu clicked");
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const getChatName = (chat: ChatResponseDto) => {
    const participant = chat.participants.find(
      (user) => user.id !== claims?.userId!
    );
    return participant?.name + " " + participant?.lastName;
  };

  const filteredChats = chats.filter((chat) => {
    const chatName = getChatName(chat);
    return chatName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <nav className={classes.chatList}>
      <div className={classes.section}>
        <Flex justify={"space-between"}>
          <Text fw={"500"} size={"xl"}>
            Chats
          </Text>
          <UnstyledButton
            style={{ width: rem(35), height: rem(35) }}
            className={"action"}
            onClick={open}
          >
            <Tooltip label="Start a new Chat" position="right">
              <IconPlus
                color="#637381"
                style={{ padding: "5px", width: rem(35), height: rem(35) }}
                stroke={1.5}
              />
            </Tooltip>
          </UnstyledButton>
        </Flex>
      </div>

      <TextInput
        placeholder="Search"
        size="xs"
        leftSection={
          <IconSearch
            style={{ width: rem(12), height: rem(12) }}
            stroke={1.5}
          />
        }
        rightSectionWidth={70}
        styles={{ section: { pointerEvents: "none" } }}
        mb="sm"
        value={searchTerm}
        onChange={handleSearchChange}
      />

      <div className={classes.section}>
        <Group className={classes.collectionsHeader} justify="space-between">
          <Text size="xs" fw={500} c="dimmed">
            All Chats
          </Text>
        </Group>
        <ScrollArea h={790} type="scroll" scrollHideDelay={500}>
          <Group dir="column" gap="xs" mt={"xs"}>
            {filteredChats.map((chat) => (
              <UserButton
                key={chat.id}
                name={getChatName(chat)}
                message={chat.lastMessage}
                onMenuClick={handleMenuClick}
                onClick={() => onChatClick(chat)}
              />
            ))}
          </Group>
        </ScrollArea>
      </div>
      <Modal
        opened={opened}
        onClose={close}
        size={"xl"}
        title={"Create Chat"}
        centered
      >
        <AddChat
          onChatCreated={() => {
            close();
            fetchChats();
          }}
        />
      </Modal>
    </nav>
  );
};

export default ChatList;
