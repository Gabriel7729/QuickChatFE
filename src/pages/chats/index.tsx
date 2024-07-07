import { useState } from "react";
import { Flex } from "@mantine/core";
import ChatList from "./components/chat-list/ChatList";
import ChatMessages from "./components/chat-messages/ChatMessages";
import ChatSection from "./components/chat-section/ChatSection";

const ChatsPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  const handleChatClick = (chat: any) => {
    setSelectedChat(chat);
  };

  return (
    <Flex>
      <ChatList onChatClick={handleChatClick} />
      {selectedChat ? (
        <ChatMessages chat={selectedChat} />
      ) : (
        <ChatSection />
      )}
    </Flex>
  );
};

export default ChatsPage;
