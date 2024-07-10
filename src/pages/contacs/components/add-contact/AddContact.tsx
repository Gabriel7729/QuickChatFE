import React, { useState } from "react";
import { Formik, Field, Form } from "formik";
import {
  TextInput,
  Box,
  Button,
  Group,
  Grid,
  Loader,
  Alert,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconAlertCircle, IconCheck, IconX } from "@tabler/icons-react";
import userService from "../../../../services/user/user.service";
import { ListContactsRequest } from "../../../../models/contact/contact.model";
import { UserInfoIcons } from "../../../../components/user-info-icons/UserInfoIcons";
import { UserResponseDto } from "../../../../models/user/user.model";
import { useAuthStore } from "../../../../common/store/session.store";

interface AddContactProps {
  onContactCreated: () => void;
}

const AddContact: React.FC<AddContactProps> = ({ onContactCreated }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchingUser, setIsFetchingUser] = useState<boolean>(false);
  const [contact, setContact] = useState<UserResponseDto | undefined>();
  const [phoneNumberOrEmailForm, setPhoneNumberOrEmailForm] =
    useState<string>("");
  const [alertMessage, setAlertMessage] = useState<string>("");

  const { claims } = useAuthStore();

  const getIfUserExists = async () => {
    try {
      setIsFetchingUser(true);
      const request: ListContactsRequest = {
        userId: claims?.userId!,
        email: phoneNumberOrEmailForm.includes("@")
          ? phoneNumberOrEmailForm
          : null,
        phoneNumber: phoneNumberOrEmailForm.includes("@")
          ? null
          : phoneNumberOrEmailForm,
      };
      const { value } = await userService.getIfUserExists(request);
      setContact(value);
      setIsFetchingUser(false);
      return value;
    } catch (error) {
      setIsFetchingUser(false);
      setAlertMessage("The Person you are trying to add is not registered.");
      console.log("Error fetching User", error);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      notifications.show({
        id: "create-contact",
        message: `Creando contacto...`,
        color: "blue",
        loading: true,
        autoClose: false,
      });

      setIsLoading(true);

      const request: ListContactsRequest = {
        userId: claims?.userId!,
        email: values.phoneNumberOrEmail.includes("@")
          ? values.phoneNumberOrEmail
          : null,
        phoneNumber: values.phoneNumberOrEmail.includes("@")
          ? null
          : values.phoneNumberOrEmail,
      };

      const response = await userService.createContact(request);

      setIsLoading(false);
      notifications.update({
        id: "create-contact",
        message: `Contacto "${
          response?.value.name + " " + response.value.lastName
        } creado exitosamente!`,
        color: "green",
        icon: <IconCheck />,
        loading: false,
        autoClose: true,
      });
      onContactCreated();
    } catch (error) {
      setIsLoading(false);
      notifications.update({
        id: "create-contact",
        message: `Ha ocurrido un error creando el contacto`,
        color: "red",
        icon: <IconX />,
        loading: false,
        autoClose: true,
      });

      console.error("Ha ocurrido un error creando el contacto", error);
    }
  };

  const defaultValues: any = {
    phoneNumberOrEmail: "",
  };

  return (
    <Box mt={"lg"}>
      <Formik
        initialValues={defaultValues}
        onSubmit={(values, { setSubmitting }) => {
          handleSubmit(values);
          setSubmitting(false);
        }}
        validateOnChange={true}
        validateOnBlur={true}
        validateOnMount={true}
      >
        {({
          handleChange,
          handleBlur,
          values,
          handleSubmit,
          errors,
          touched,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Grid mb={"sm"} grow>
              <Grid.Col span={12}>
                <Field
                  name="phoneNumberOrEmail"
                  as={TextInput}
                  label="Phone Number or Email"
                  placeholder="Phone Number or Email"
                  error={
                    touched.phoneNumberOrEmail && errors.phoneNumberOrEmail
                  }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleChange(e);
                    setPhoneNumberOrEmailForm(e.target.value);
                    setAlertMessage("");
                    setContact(undefined);
                  }}
                  onBlur={(e: any) => {
                    handleBlur(e);
                    if (e.target.value !== "") {
                      getIfUserExists();
                    }
                  }}
                  value={values.phoneNumberOrEmail}
                  withAsterisk
                  disabled={isFetchingUser}
                />
                {isFetchingUser && <Loader size="sm" />}
              </Grid.Col>
            </Grid>
            {alertMessage && (
              <Alert
                variant="light"
                color="yellow"
                title="Alert"
                icon={<IconAlertCircle size="1rem" />}
              >
                {alertMessage}
              </Alert>
            )}
            {contact && (
              <UserInfoIcons
                name={contact.name}
                email={contact.email}
                phone={contact.phoneNumber}
              />
            )}
            <Group mt="xl" justify="flex-end">
              <Button
                disabled={!contact || isLoading || isFetchingUser}
                loading={isLoading}
                color={"#228BE6"}
                type="submit"
              >
                Crear
              </Button>
            </Group>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default AddContact;
