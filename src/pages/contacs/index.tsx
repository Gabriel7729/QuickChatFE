import { useState } from "react";
import { Drawer, Flex } from "@mantine/core";
import ContactsList from "./components/contacts-list/ContactsList";
import { UserResponseDto } from "../../models/user/user.model";
import ContactSection from "./components/contact-section/ContactSection";
import { useDisclosure } from "@mantine/hooks";

const ContactsPage = () => {
  const [selectedContact, setSelectedContact] = useState<UserResponseDto>();
  const [opened, { open, close }] = useDisclosure(false);

  const handleContactClick = (contact: UserResponseDto) => {
    setSelectedContact(contact);
    open();
  };

  return (
    <Flex>
      <ContactsList onContactClick={handleContactClick} />
      {selectedContact && (
        <Drawer opened={opened} onClose={close} title="Contact info" position="right" bg={"#F0F4FA"}>
          <ContactSection contactSelected={selectedContact} />
        </Drawer>
      )}
    </Flex>
  );
};

export default ContactsPage;
