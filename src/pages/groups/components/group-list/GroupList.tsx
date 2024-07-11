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
import classes from "./GroupList.module.css";
import { UserButton } from "../../../../components/user-button/UserButton";
import { ChatResponseDto } from "../../../../models/chat/chat.model";
import chatService from "../../../../services/chat/chat.service";
import { useAuthStore } from "../../../../common/store/session.store";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "../../../../common/utils/route.utils";
import AddGroup from "../add-group/AddGroup";

interface GroupListProps {
  onGroupClick: (chat: ChatResponseDto) => void;
}

export const GroupList: React.FC<GroupListProps> = ({ onGroupClick }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [chats, setChats] = useState<ChatResponseDto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { claims } = useAuthStore();

  const query = useQuery();
  const contactId = query.get("contactId");

  const fetchChats = async () => {
    try {
      const { value } = await chatService.getChatsFromUser(claims?.userId!);
      const groups = value.filter((chat) => chat.isGroupChat);
      setChats(groups);
    } catch (error) {
      console.log("Error fetching Chats", error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (contactId) {
      const chat = chats.find((chat) =>
        chat.participants.some((user) => user.id === contactId)
      );
      if (chat) {
        onGroupClick(chat);
      }
    }
  }, [setChats, query, contactId, chats]);

  const handleExportPdf = async (chatId: string) => {
    try {
      const response = await chatService.exportChatToPdf(chatId);
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      const chatName = chats.find((chat) => chat.id === chatId)?.groupName;
      link.setAttribute("download", `Chat-${chatName}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("There was an error exporting the chat to pdf", error);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const getChatName = (chat: ChatResponseDto) => {
    return chat.groupName;
  };

  const filteredChats = chats.filter((chat) => {
    const chatName = getChatName(chat);
    return chatName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <nav className={classes.GroupList}>
      <div className={classes.section}>
        <Flex justify={"space-between"}>
          <Text fw={"500"} size={"xl"}>
            Groups
          </Text>
          <UnstyledButton
            style={{ width: rem(35), height: rem(35) }}
            className={"action"}
            onClick={open}
          >
            <Tooltip label="Start a new Group Chat" position="right">
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
            All Groups
          </Text>
        </Group>
        <ScrollArea h={790} type="scroll" scrollHideDelay={500}>
          <Group dir="column" gap="xs" mt={"xs"}>
            {filteredChats.map((chat) => (
              <UserButton
                key={chat.id}
                name={getChatName(chat)}
                message={chat.lastMessage}
                onMenuClick={() => {}}
                onExportPdf={() => {
                  handleExportPdf(chat.id);
                }}
                onClick={() => onGroupClick(chat)}
              />
            ))}
          </Group>
        </ScrollArea>
      </div>
      <Modal
        opened={opened}
        onClose={close}
        size={"xl"}
        title={"Create Group Chat"}
        centered
      >
        <AddGroup
          onChatCreated={() => {
            close();
            fetchChats();
          }}
        />
      </Modal>
    </nav>
  );
};

export default GroupList;
