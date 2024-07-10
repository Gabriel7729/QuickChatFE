import { useState } from "react";
import { Flex } from "@mantine/core";
import ContactsList from "./components/contacts-list/ContactsList";

const ContactsPage = () => {
  const [selectedContact, setSelectedContact] = useState(null);

  const handleContactClick = (Contact: any) => {
    setSelectedContact(Contact);
  };

  return (
    <Flex>
      <ContactsList onContactClick={handleContactClick} />
      {/* {selectedContact ? (
        <ContactMessages Contact={selectedContact} />
      ) : (
        <ContactSection />
      )} */}
    </Flex>
  );
};

export default ContactsPage;
