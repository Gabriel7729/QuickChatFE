import { useState } from "react";
import { Flex } from "@mantine/core";
import { ChatResponseDto } from "../../models/chat/chat.model";
import { useNavigate, useLocation } from "react-router-dom";
import GroupList from "./components/group-list/GroupList";
import GroupMessages from "./components/group-messages/GroupMessages";

const GroupsPage = () => {
  const [selectedGroup, setSelectedGroup] = useState<ChatResponseDto | null>(
    null
  );
  const navigate = useNavigate();
  const location = useLocation();

  const handleGroupChatClick = (chat: ChatResponseDto) => {
    const params = new URLSearchParams(location.search);
    params.delete("contactId");
    navigate({
      pathname: location.pathname,
      search: params.toString(),
    });
    setSelectedGroup(chat);
  };

  return (
    <Flex>
      <GroupList onGroupClick={handleGroupChatClick} />
      {selectedGroup && <GroupMessages chat={selectedGroup} />}
    </Flex>
  );
};

export default GroupsPage;
