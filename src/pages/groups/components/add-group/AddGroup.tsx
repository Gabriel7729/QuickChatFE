import React, { useEffect, useState } from "react";
import { Formik, Field, Form } from "formik";
import { Box, Button, Group, Grid, Select, TextInput, MultiSelect } from "@mantine/core";
import { z } from "zod";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import userService from "../../../../services/user/user.service";
import { ListContactsRequest } from "../../../../models/contact/contact.model";
import { UserResponseDto } from "../../../../models/user/user.model";
import { zodResolver } from "@mantine/form";
import { useAuthStore } from "../../../../common/store/session.store";
import chatService from "../../../../services/chat/chat.service";

interface AddGroupProps {
  onChatCreated: () => void;
}

const groupSchema = z.object({
  groupName: z.string().min(1, { message: "The group name is required" }),
  memberIds: z.array(z.string().min(1, { message: "The member is required" })),
});

const AddGroup: React.FC<AddGroupProps> = ({ onChatCreated }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contacts, setContacts] = useState<UserResponseDto[]>([]);
  const zodValidateGroup = zodResolver<any>(groupSchema);

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

  const handleSubmit = async (values: any) => {
    try {
      notifications.show({
        id: "create-group",
        message: `Creating Group...`,
        color: "blue",
        loading: true,
        autoClose: false,
      });

      setIsLoading(true);

      const createGroupRequest = {
        adminId: claims?.userId!,
        groupName: values.groupName,
        memberIds: values.memberIds,
      };

      await chatService.createGroupChat(createGroupRequest);

      setIsLoading(false);
      notifications.update({
        id: "create-group",
        message: `Group Created successfully!`,
        color: "green",
        icon: <IconCheck />,
        loading: false,
        autoClose: true,
      });
      onChatCreated();
    } catch (error) {
      setIsLoading(false);
      notifications.update({
        id: "create-group",
        message: `There was an error creating the group`,
        color: "red",
        icon: <IconX />,
        loading: false,
        autoClose: true,
      });

      console.error("There was an error creating the group", error);
    }
  };

  const defaultValues = {
    groupName: "",
    memberIds: [],
  };

  return (
    <Box mt={"lg"}>
      <Formik
        initialValues={defaultValues}
        onSubmit={(values, { setSubmitting }) => {
          handleSubmit(values);
          setSubmitting(false);
        }}
        validate={zodValidateGroup}
        validateOnChange={true}
        validateOnBlur={true}
        validateOnMount={true}
      >
        {({ handleSubmit, isValid }) => (
          <Form onSubmit={handleSubmit}>
            <Grid mb={"sm"} grow>
              <Grid.Col span={12}>
                <Field name={`groupName`}>
                  {({ field, form }: any) => (
                    <TextInput
                      {...field}
                      label={"Group Name"}
                      placeholder={"Enter group name"}
                      error={
                        form.touched.groupName && form.errors.groupName
                          ? form.errors.groupName
                          : undefined
                      }
                      onChange={form.handleChange}
                      value={field.value}
                    />
                  )}
                </Field>
              </Grid.Col>
              <Grid.Col span={12}>
                <Field name={`memberIds`}>
                  {({ field, form }: any) => (
                    <MultiSelect
                      {...field}
                      data={contacts.map((contact) => ({
                        label: `${contact.name} ${contact.lastName}`,
                        value: contact.id,
                      }))}
                      label={"Members"}
                      placeholder={"Select members"}
                      error={
                        form.touched.memberIds && form.errors.memberIds
                          ? form.errors.memberIds
                          : undefined
                      }
                      onChange={(value) => {
                        form.setFieldValue("memberIds", value);
                      }}
                      value={field.value}
                      clearable
                      searchable
                      multiple
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
                Create Group
              </Button>
            </Group>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default AddGroup;
