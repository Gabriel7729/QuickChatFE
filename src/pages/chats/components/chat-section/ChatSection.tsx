import { Container, Text, Button, Center, Image, Box } from "@mantine/core";
import { IconMessageCircle } from "@tabler/icons-react";
import chatImage from "../../../../assets/images/start a new chat.jpg"; // Replace with the correct path to your image

const ChatSection = () => {
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
          component="a"
          href="/start-chat"
          variant="outline"
          size="md"
          mt="md"
          leftSection={<IconMessageCircle size={18} />}
        >
          Start a Chat
        </Button>
      </Box>
    </Container>
  );
};

export default ChatSection;
