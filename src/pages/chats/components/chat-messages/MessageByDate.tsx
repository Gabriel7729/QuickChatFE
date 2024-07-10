import { Divider } from "@mantine/core";
import { MessageComponent } from "./MessageComponent";

interface MessagesByDateProps {
  date: string;
  messages: any[];
}

export const MessagesByDate: React.FC<MessagesByDateProps> = ({
  date,
  messages,
}) => {
  return (
    <div>
      <Divider my="sm" label={date} labelPosition="center" />
      {messages.map((message, index) => (
        <MessageComponent
          key={"Message" + index}
          message={message}
          isUserMessage={message.isUserMessage}
        />
      ))}
    </div>
  );
};
