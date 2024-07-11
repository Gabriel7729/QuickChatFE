import { Stack, Card, Text } from "@mantine/core";
import { format } from "date-fns";

interface GroupMessageComponentProps {
  message: any;
  isUserMessage: boolean;
  senderName: string;
}

export const GroupMessageComponent: React.FC<GroupMessageComponentProps> = ({
  message,
  isUserMessage,
  senderName,
}) => {
  return (
    <Stack align={isUserMessage ? "flex-end" : "flex-start"} gap="xs" mb="sm">
      <Text size="xs" c="dimmed">
        {format(message.time, "h:mm a")}
      </Text>
      <Card
        padding="md"
        withBorder
        style={{
          backgroundColor: isUserMessage ? "#0162C4" : "#FFF",
          alignSelf: isUserMessage ? "flex-end" : "flex-start",
          color: isUserMessage ? "#FFF" : "#000",
        }}
      >
        {!isUserMessage && (
          <Text size="xs" c="dimmed">
            {senderName}
          </Text>
        )}
        <Text size="sm">{message.text}</Text>
        {message.type === "media" && message.mediaUrl && (
          <img
            src={message.mediaUrl}
            alt={message.text}
            style={{ maxWidth: "100%", borderRadius: "8px", marginTop: "10px" }}
          />
        )}
      </Card>
    </Stack>
  );
};
