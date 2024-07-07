import React, { useState } from "react";
import {
  Flex,
  Group,
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

interface Chat {
  id: number;
  name: string;
  message: string;
}

const fakeChats: Chat[] = [
  { id: 1, name: "Gabriel De La Rosa", message: "Hola bro, como estas?" },
  { id: 2, name: "Maria Gomez", message: "Buenos días!" },
  { id: 3, name: "Juan Perez", message: "¿Qué tal tu día?" },
  { id: 4, name: "Ana Martinez", message: "Vamos a reunirnos mañana." },
  { id: 5, name: "Carlos Lopez", message: "Feliz cumpleaños!" },
  { id: 6, name: "Laura Sanchez", message: "Nos vemos el lunes." },
  { id: 7, name: "Miguel Ramirez", message: "¿Puedes enviarme el informe?" },
  { id: 8, name: "Sofia Torres", message: "¡Excelente trabajo!" },
  { id: 9, name: "Jorge Hernandez", message: "¿A qué hora es la reunión?" },
  { id: 10, name: "Lucia Diaz", message: "Me encantó tu presentación." },
];

interface ChatListProps {
  onChatClick: (chat: Chat) => void;
}

export const ChatList: React.FC<ChatListProps> = ({ onChatClick }) => {
  const [chats, setChats] = useState<Chat[]>(fakeChats);
  const [searchTerm, setSearchTerm] = useState("");

  const handleMenuClick = () => {
    console.log("Menu clicked");
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                name={chat.name}
                message={chat.message}
                onMenuClick={handleMenuClick}
                onClick={() => onChatClick(chat)}
              />
            ))}
          </Group>
        </ScrollArea>
      </div>
    </nav>
  );
};

export default ChatList;
