import React, { useEffect, useState } from "react";
import { Formik, Field, Form } from "formik";
import { Box, Button, Group, Grid, Select } from "@mantine/core";
import { z } from "zod";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import userService from "../../../../services/user/user.service";
import { ListContactsRequest } from "../../../../models/contact/contact.model";
import { UserResponseDto } from "../../../../models/user/user.model";
import { zodResolver } from "@mantine/form";
import { useAuthStore } from "../../../../common/store/session.store";
import { StartChatRequest } from "../../../../models/chat/chat.model";
import chatService from "../../../../services/chat/chat.service";

interface AddChatProps {
  onChatCreated: () => void;
}

const contactSchema = z.object({
  contactId: z.string().min(1, { message: "The contact is required" }),
});

const AddChat: React.FC<AddChatProps> = ({ onChatCreated }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contacts, setContacts] = useState<UserResponseDto[]>([]);
  const zodValidateContact = zodResolver<any>(contactSchema);

  const { claims } = useAuthStore();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const request: ListContactsRequest = {
          userId: claims?.userId!,
          email: null,
          phoneNumber: null,
        };
        const { value } = await userService.getContactsFromUser(request);
        setContacts(value);
      } catch (error) {
        console.log("Error fetching contacts", error);
      }
    };

    fetchContacts();
  }, []);

  const handleSubmit = async (values: StartChatRequest) => {
    try {
      notifications.show({
        id: "create-chat",
        message: `Creating Chat...`,
        color: "blue",
        loading: true,
        autoClose: false,
      });

      setIsLoading(true);

      await chatService.startChat(values);

      setIsLoading(false);
      notifications.update({
        id: "create-chat",
        message: `Chat Started successfully!`,
        color: "green",
        icon: <IconCheck />,
        loading: false,
        autoClose: true,
      });
      onChatCreated();
    } catch (error) {
      setIsLoading(false);
      notifications.update({
        id: "create-chat",
        message: `There was an error creating the chat`,
        color: "red",
        icon: <IconX />,
        loading: false,
        autoClose: true,
      });

      console.error("There was an error creating the chat", error);
    }
  };

  const defaultValues: StartChatRequest = {
    contactId: "",
    userId: claims?.userId!,
  };

  return (
    <Box mt={"lg"}>
      <Formik
        initialValues={defaultValues || contactSchema }
        onSubmit={(values, { setSubmitting }) => {
          handleSubmit(values);
          setSubmitting(false);
        }}
        validate={zodValidateContact}
        validateOnChange={true}
        validateOnBlur={true}
        validateOnMount={true}
      >
        {({ handleSubmit, isValid }) => (
          <Form onSubmit={handleSubmit}>
            <Grid mb={"sm"} grow>
              <Grid.Col span={12}>
                <Field name={`contactId`}>
                  {({ field, form }: any) => (
                    <Select
                      {...field}
                      data={contacts.map((contact) => ({
                        label: `${contact.name} ${contact.lastName}`,
                        value: contact.id,
                      }))}
                      label={"Contact"}
                      placeholder={"Select a contact"}
                      error={
                        form.touched.contactId && form.errors.contactId
                          ? form.errors.contactId
                          : undefined
                      }
                      onChange={(value) => {
                        form.setFieldValue("contactId", value);
                      }}
                      value={String(field.value)}
                      clearable
                      allowDeselect
                      searchable
                    />
                  )}
                </Field>
              </Grid.Col>
            </Grid>
            <Group mt="xl" justify="flex-end">
              <Button
                disabled={!isValid}
                loading={isLoading}
                color={"#f18835"}
                type="submit"
              >
                Start Chat
              </Button>
            </Group>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default AddChat;
