import {
  Container,
  Text,
  Button,
  Center,
  Image,
  Box,
  Modal,
} from "@mantine/core";
import { IconMessageCircle } from "@tabler/icons-react";
import chatImage from "../../../../assets/images/start a new chat.jpg"; // Replace with the correct path to your image
import { useDisclosure } from "@mantine/hooks";
import AddChat from "../add-chat/AddChat";
import { useAuthStore } from "../../../../common/store/session.store";
import { useEffect, useState } from "react";
import { ChatResponseDto } from "../../../../models/chat/chat.model";
import chatService from "../../../../services/chat/chat.service";

const ChatSection = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [chats, setChats] = useState<ChatResponseDto[]>([]);
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

  return (
    <Container
      size="sm"
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box style={{ textAlign: "center" }}>
        <Center>
          <Image
            radius="md"
            src={chatImage}
            alt="Start a new chat"
            width={300}
            height={200}
          />
        </Center>
        <Text size="xl" fw={700} mt="md">
          Start a New Chat
        </Text>
        <Text size="md" c="dimmed" mt="xs">
          Connect with your friends and family, share your thoughts, and stay in
          touch with everyone.
        </Text>
        <Button
          variant="outline"
          size="md"
          mt="md"
          onClick={open}
          leftSection={<IconMessageCircle size={18} />}
        >
          Start a Chat
        </Button>
      </Box>
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
    </Container>
  );
};

export default ChatSection;
