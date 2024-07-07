// src/components/AddOrEditUser.tsx
import React, { useState } from "react";
import { Formik, Field, Form } from "formik";
import {
  TextInput,
  Box,
  Button,
  Group,
  Grid,
  Select,
  Text,
} from "@mantine/core";
import { z } from "zod";
import { notifications } from "@mantine/notifications";
import {
  UpdateUserDto,
  UserResponseDto,
} from "../../../models/user/user.model";
import userService from "../../../services/user/user.service";
import { ResponseModel } from "../../../models/base.model";
import { zodResolver } from "../../../common/utils/zod.utils";
import { UserRole } from "../../../common/enums/user.enum";
import { IconCheck, IconX } from "@tabler/icons-react";
import {
  formatValueSelectToEnum,
  getEnumSelectOptions,
} from "../../../common/utils/enum.utils";

interface AddOrEditUserProps {
  onUserCreated: () => void;
  userToEdit?: UserResponseDto;
  isUserRoleAdmin: boolean;
}

const userSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  userName: z.string().min(1, { message: "Username is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  idNumber: z.string().min(1, { message: "ID number is required" }),
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  role: z.nativeEnum(UserRole),
});

const AddOrEditUser: React.FC<AddOrEditUserProps> = ({
  onUserCreated,
  userToEdit,
  isUserRoleAdmin,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const zodValidateUser = zodResolver<UpdateUserDto>(userSchema);

  const selectUserRoleOptions = getEnumSelectOptions(UserRole).filter(
    (role) => {
      return role.value !== `${UserRole.ADMIN}`;
    }
  );

  const handleSubmit = async (values: UpdateUserDto) => {
    try {
      let response: ResponseModel<UserResponseDto> | undefined = undefined;

      notifications.show({
        id: "create-update-user",
        message: `${userToEdit ? "Actualizando" : "Creando"} Usuario...`,
        color: "blue",
        loading: true,
        autoClose: false,
      });

      setIsLoading(true);

      if (userToEdit) {
        values.id = userToEdit.id;
        response = await userService.put(``, values);
      } else {
        response = await userService.post(``, values);
      }

      setIsLoading(false);
      notifications.update({
        id: "create-update-user",
        message: `Usuario "${response?.value.userName}" ${
          userToEdit ? "actualizado" : "creado"
        } exitosamente!`,
        color: "green",
        icon: <IconCheck />,
        loading: false,
        autoClose: true,
      });
      onUserCreated();
    } catch (error) {
      setIsLoading(false);
      notifications.update({
        id: "create-update-user",
        message: `Ha ocurrido un error ${
          userToEdit ? "actualizando" : "creando"
        } los datos del usuario.`,
        color: "red",
        icon: <IconX />,
        loading: false,
        autoClose: true,
      });

      console.error("Ha ocurrido un error creando el usuario", error);
    }
  };

  const defaultValues: UpdateUserDto = {
    id: "",
    name: "",
    lastName: "",
    userName: "",
    address: "",
    idNumber: "",
    phoneNumber: "",
    email: "",
    role: UserRole.ADMIN,
  };

  return (
    <Box mt={"lg"}>
      <Formik
        initialValues={userToEdit || defaultValues}
        onSubmit={(values, { setSubmitting }) => {
          handleSubmit(values);
          setSubmitting(false);
        }}
        validate={zodValidateUser}
        validateOnChange={true}
        validateOnBlur={true}
        validateOnMount={true}
      >
        {({ handleSubmit, errors, touched, isValid }) => (
          <Form onSubmit={handleSubmit}>
            <Text fw={"bold"} c={"#F18835"} mb={"lg"}>
              Información General
            </Text>

            <Grid mb={"sm"} grow>
              <Grid.Col span={6}>
                <Field
                  name="name"
                  as={TextInput}
                  label="Nombre"
                  placeholder="Nombre"
                  error={touched.name && errors.name}
                  withAsterisk
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Field
                  name="lastName"
                  as={TextInput}
                  label="Apellido"
                  placeholder="Apellido"
                  error={touched.lastName && errors.lastName}
                  withAsterisk
                />
              </Grid.Col>
            </Grid>
            <Grid mb={"sm"} grow>
              <Grid.Col span={6}>
                <Field
                  name="idNumber"
                  as={TextInput}
                  label="Cédula"
                  placeholder="Cédula"
                  error={touched.idNumber && errors.idNumber}
                  withAsterisk
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Field
                  name="userName"
                  as={TextInput}
                  label="Nombre de Usuario"
                  placeholder="Nombre de Usuario"
                  error={touched.userName && errors.userName}
                  withAsterisk
                />
              </Grid.Col>
            </Grid>
            {!isUserRoleAdmin && (
              <Grid>
                <Grid.Col span={6}>
                  <Field name="role">
                    {({ field, form }: any) => {
                      return (
                        <Select
                          {...field}
                          data={selectUserRoleOptions}
                          label="Role"
                          placeholder="Selecciona un rol"
                          error={
                            form.touched.role && form.errors.role
                              ? form.errors.role
                              : undefined
                          }
                          onChange={(value) => {
                            form.setFieldValue(
                              "role",
                              formatValueSelectToEnum(value!, UserRole)
                            );
                          }}
                          value={String(field.value)}
                          clearable
                          allowDeselect
                          searchable
                          withAsterisk
                        />
                      );
                    }}
                  </Field>
                </Grid.Col>
              </Grid>
            )}

            <Text fw={"bold"} c={"#F18835"} mb={"lg"} mt={"lg"}>
              Información de Contacto
            </Text>

            <Grid grow mb={"sm"}>
              <Grid.Col span={6}>
                <Field
                  name="email"
                  as={TextInput}
                  label="Correo Electrónico"
                  placeholder="Correo Electrónico"
                  error={touched.email && errors.email}
                  withAsterisk
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Field
                  name="phoneNumber"
                  as={TextInput}
                  label="Número de Teléfono"
                  placeholder="Número de Teléfono"
                  error={touched.phoneNumber && errors.phoneNumber}
                  withAsterisk
                />
              </Grid.Col>
            </Grid>
            <Grid grow>
              <Grid.Col span={6}>
                <Field
                  name="address"
                  as={TextInput}
                  label="Dirección"
                  placeholder="Dirección"
                  error={touched.address && errors.address}
                  withAsterisk
                />
              </Grid.Col>
            </Grid>
            <Group mt="xl" justify="flex-end">
              <Button
                disabled={!isValid}
                loading={isLoading}
                color={"#f18835"}
                type="submit"
              >
                {userToEdit ? "Editar" : "Crear"}
              </Button>
            </Group>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default AddOrEditUser;
