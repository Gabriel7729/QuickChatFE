import { useState } from "react";
import { Flex } from "@mantine/core";
import ChatList from "./components/chat-list/ChatList";
import ChatMessages from "./components/chat-messages/ChatMessages";
import ChatSection from "./components/chat-section/ChatSection";
import { ChatResponseDto } from "../../models/chat/chat.model";
import { useNavigate, useLocation } from "react-router-dom";

const ChatsPage = () => {
  const [selectedChat, setSelectedChat] = useState<ChatResponseDto | null>(
    null
  );
  const navigate = useNavigate();
  const location = useLocation();

  const handleChatClick = (chat: ChatResponseDto) => {
    const params = new URLSearchParams(location.search);
    params.delete("contactId");
    navigate({
      pathname: location.pathname,
      search: params.toString(),
    });
    setSelectedChat(chat);
  };

  return (
    <Flex>
      <ChatList onChatClick={handleChatClick} />
      {selectedChat ? <ChatMessages chat={selectedChat} /> : <ChatSection />}
    </Flex>
  );
};

export default ChatsPage;
