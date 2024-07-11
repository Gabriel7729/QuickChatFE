import { Divider } from "@mantine/core";
import { GroupMessageComponent } from "./GroupMessageComponent";

interface GroupMessageByDateProps {
  date: string;
  messages: any[];
}

export const GroupMessageByDate: React.FC<GroupMessageByDateProps> = ({
  date,
  messages,
}) => {
  return (
    <div>
      <Divider my="sm" label={date} labelPosition="center" />
      {messages.map((message, index) => (
        <GroupMessageComponent
          key={"Message" + index}
          message={message}
          isUserMessage={message.isUserMessage}
          senderName={message.senderName}
        />
      ))}
    </div>
  );
};
