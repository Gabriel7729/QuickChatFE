import React, { useEffect, useState } from "react";
import {
  Flex,
  Group,
  Modal,
  rem,
  ScrollArea,
  Text,
  TextInput,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { IconSearch, IconPlus } from "@tabler/icons-react";
import { UserButton } from "../../../../components/user-button/UserButton";
import { useAuthStore } from "../../../../common/store/session.store";
import userService from "../../../../services/user/user.service";
import { ListContactsRequest } from "../../../../models/contact/contact.model";
import { UserResponseDto } from "../../../../models/user/user.model";
import classes from "./ContactsList.module.css";
import { useDisclosure } from "@mantine/hooks";
import AddContact from "../add-contact/AddContact";

interface ContactsListProps {
  onContactClick: (contact: UserResponseDto) => void;
}

export const ContactsList: React.FC<ContactsListProps> = ({
  onContactClick,
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [contacts, setContacts] = useState<UserResponseDto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { claims } = useAuthStore();

  const fetchContacts = async () => {
    try {
      const request: ListContactsRequest = {
        userId: claims?.userId!,
        email: "",
        phoneNumber: "",
      };
      const { value } = await userService.getContactsFromUser(request);
      setContacts(value);
    } catch (error) {
      console.log("Error fetching Chats", error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredContacts = contacts.filter((contact) => {
    const contactName = contact.name + " " + contact.lastName;
    return contactName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <nav className={classes.contactList}>
      <div className={classes.section}>
        <Flex justify={"space-between"}>
          <Text fw={"500"} size={"xl"}>
            Contacts
          </Text>
          <UnstyledButton
            style={{ width: rem(35), height: rem(35) }}
            className={"action"}
            onClick={open}
          >
            <Tooltip label="Create a new Contact" position="right">
              <IconPlus
                color="#637381"
                style={{ padding: "5px", width: rem(35), height: rem(35) }}
                stroke={1.5}
              />
            </Tooltip>
          </UnstyledButton>
        </Flex>
      </div>

      <TextInput
        placeholder="Search"
        size="xs"
        leftSection={
          <IconSearch
            style={{ width: rem(12), height: rem(12) }}
            stroke={1.5}
          />
        }
        rightSectionWidth={70}
        styles={{ section: { pointerEvents: "none" } }}
        mb="sm"
        value={searchTerm}
        onChange={handleSearchChange}
      />

      <div className={classes.section}>
        <Group className={classes.collectionsHeader} justify="space-between">
          <Text size="xs" fw={500} c="dimmed">
            All Contacts
          </Text>
        </Group>
        <ScrollArea h={790} type="scroll" scrollHideDelay={500}>
          <Group dir="column" gap="xs" mt={"xs"}>
            {filteredContacts.map((contact) => (
              <UserButton
                key={contact.id}
                name={contact.name + " " + contact.lastName}
                message={contact.email}
                onClick={() => onContactClick(contact)}
              />
            ))}
          </Group>
        </ScrollArea>
      </div>
      <Modal
        opened={opened}
        onClose={close}
        size={"xl"}
        title={"Create Contact"}
        centered
      >
        <AddContact
          onContactCreated={() => {
            close();
            fetchContacts();
          }}
        />
      </Modal>
    </nav>
  );
};

export default ContactsList;
