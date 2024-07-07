import React from "react";
import { HoverCard, Button, Group, Text } from "@mantine/core";

interface CustomHoverCardProps {
  textButton: string;
  text: string;
}

const CustomHoverCard: React.FC<CustomHoverCardProps> = ({
  textButton,
  text,
}) => {
  return (
    <Group justify="center">
      <HoverCard width={280} shadow="md">
        <HoverCard.Target>
          <Button
            size="xs"
            variant="gradient"
            gradient={{ from: "indigo", to: "cyan" }}
          >
            {textButton}
          </Button>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <Text size="sm">{text}</Text>
        </HoverCard.Dropdown>
      </HoverCard>
    </Group>
  );
};

export default CustomHoverCard;
