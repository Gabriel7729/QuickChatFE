import { Text, Button, Avatar, Paper, Stack, Group } from "@mantine/core";
import { useAuthStore } from "../../../../common/store/session.store";
import { memo, useEffect, useState } from "react";
import { UserResponseDto } from "../../../../models/user/user.model";
import {
  formatPhoneNumber,
  getFirstLetter,
} from "../../../../common/utils/utils";
import { getRandomColorHex } from "../../../../common/utils/color.utils";
import chatService from "../../../../services/chat/chat.service";
import { GroupResponseDto } from "../../../../models/chat/group.model";
import { useNavigate } from "react-router-dom";

interface AvatarChatLetterProps {
  name: string;
  size: number;
  radius: number;
}

const AvatarChatLetter: React.FC<AvatarChatLetterProps> = memo(
  ({ name, size, radius }) => {
    return (
      <Avatar color={getRandomColorHex()} size={size} radius={radius} mx="auto">
        {getFirstLetter(name)}
      </Avatar>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.name === nextProps.name;
  }
);

interface ContactSectionProps {
  contactSelected: UserResponseDto;
}

const ContactSection: React.FC<ContactSectionProps> = ({ contactSelected }) => {
  const [groupsInCommon, setGroupsInCommon] = useState<GroupResponseDto[]>([]);
  const { claims } = useAuthStore();
  const navigate = useNavigate();

  const fetchGroupsInCommon = async () => {
    try {
      const { value } = await chatService.getGroupsInCommon(
        claims?.userId!,
        contactSelected.id
      );
      setGroupsInCommon(value);
    } catch (error) {
      console.log("Error fetching Groups In common", error);
    }
  };

  useEffect(() => {
    fetchGroupsInCommon();
  }, [contactSelected]);

  return (
    <Stack>
      <Paper radius="md" withBorder p="lg" bg="var(--mantine-color-body)">
        <AvatarChatLetter name={contactSelected.name} size={120} radius={120} />
        <Text ta="center" fz="lg" fw={500} mt="md">
          {contactSelected.name} {contactSelected.lastName}
        </Text>
        <Text ta="center" c="dimmed" fz="sm">
          {contactSelected.email} •{" "}
          {formatPhoneNumber(contactSelected.phoneNumber)}
        </Text>

        <Button variant="default" bg={"#F8FAFF"} fullWidth mt="md" onClick={() => navigate(`/chats?contactId=${contactSelected.id}`)}>
          Send a message
        </Button>
      </Paper>
      <Text mt="lg" fz="lg" fw={500}>
        Groups in Common
      </Text>
      {groupsInCommon.map((group) => (
        <Group gap="sm" mt={"md"} key={group.id}>
          <Avatar color={getRandomColorHex()} size={40} radius={40}>
            {getFirstLetter(group.name)}
          </Avatar>
          <div>
            <Text fz="sm" fw={500}>
              {group.name}
            </Text>
            <Text fz="xs" c="dimmed">
              {group.totalMembers} Members
            </Text>
          </div>
        </Group>
      ))}
    </Stack>
  );
};

export default ContactSection;
