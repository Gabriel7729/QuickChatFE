import React, { useState } from "react";
import { Formik, Field, Form } from "formik";
import { TextInput, Box, Button, Group, Grid } from "@mantine/core";
import { z } from "zod";
import { notifications } from "@mantine/notifications";
import { ResponseModel } from "../../../models/base.model";
import { zodResolver } from "../../../common/utils/zod.utils";
import { IconCheck, IconX } from "@tabler/icons-react";
import {
  CustomerDto,
  CustomerResponseDto,
} from "../../../models/customer/customer.model";
import { useAuthStore } from "../../../common/store/session.store";
import customerService from "../../../services/customer/customer.service";

interface AddOrEditCustomerProps {
  onCustomerCreated: () => void;
  customerToEdit?: CustomerResponseDto;
}

const phoneNumberRegex = /^[0-9]{10,15}$/;

const customerSchema = z.object({
  firstName: z.string().min(1, { message: "El nombre es requerido" }),
  lastName: z.string().min(1, { message: "El apellido es requerido" }),
  email: z
    .string()
    .email({ message: "El correo electrónico no es válido" })
    .or(z.literal("")),
  phoneNumber: z
    .string()
    .regex(phoneNumberRegex, { message: "El número de teléfono no es válido" })
    .or(z.literal("")),
  idNumber: z.string().or(z.literal("")),
  branchId: z.string().min(1, { message: "El id de la sucursal es requerido" }),
});

const AddOrEditCustomer: React.FC<AddOrEditCustomerProps> = ({
  onCustomerCreated,
  customerToEdit,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const zodValidateCustomer = zodResolver<CustomerDto>(customerSchema);

  const { claims } = useAuthStore();

  const handleSubmit = async (values: CustomerDto) => {
    try {
      let response: ResponseModel<CustomerResponseDto> | undefined = undefined;

      notifications.show({
        id: "create-update-customer",
        message: `${customerToEdit ? "Actualizando" : "Creando"} Cliente...`,
        color: "blue",
        loading: true,
        autoClose: false,
      });

      setIsLoading(true);

      if (customerToEdit) {
        values.id = customerToEdit.id;
        response = await customerService.put(``, values);
      } else {
        response = await customerService.post(``, values);
      }

      setIsLoading(false);
      notifications.update({
        id: "create-update-customer",
        message: `Cliente "${response?.value.firstName} ${
          response.value.lastName
        }" ${customerToEdit ? "actualizado" : "creado"} exitosamente!`,
        color: "green",
        icon: <IconCheck />,
        loading: false,
        autoClose: true,
      });
      onCustomerCreated();
    } catch (error) {
      setIsLoading(false);
      notifications.update({
        id: "create-update-customer",
        message: `Ha ocurrido un error ${
          customerToEdit ? "actualizando" : "creando"
        } los datos del cliente.`,
        color: "red",
        icon: <IconX />,
        loading: false,
        autoClose: true,
      });

      console.error("Ha ocurrido un error creando el cliente", error);
    }
  };

  const defaultValues: CustomerDto = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    idNumber: "",
    branchId: claims?.branchId!,
  };

  return (
    <Box mt={"lg"}>
      <Formik
        initialValues={customerToEdit || defaultValues}
        onSubmit={(values, { setSubmitting }) => {
          handleSubmit(values);
          setSubmitting(false);
        }}
        validate={zodValidateCustomer}
        validateOnChange={true}
        validateOnBlur={true}
        validateOnMount={true}
      >
        {({ handleSubmit, errors, touched, isValid }) => (
          <Form onSubmit={handleSubmit}>
            <Grid mb={"sm"} grow>
              <Grid.Col span={6}>
                <Field
                  name="firstName"
                  as={TextInput}
                  label="Nombre"
                  placeholder="Nombre"
                  error={touched.firstName && errors.firstName}
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
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Field
                  name="email"
                  as={TextInput}
                  label="Correo Electrónico"
                  placeholder="Correo Electrónico"
                  error={touched.email && errors.email}
                />
              </Grid.Col>
            </Grid>
            <Grid mb={"sm"} grow>
              <Grid.Col span={6}>
                <Field
                  name="phoneNumber"
                  as={TextInput}
                  label="Número de Teléfono"
                  placeholder="Número de Teléfono"
                  error={touched.phoneNumber && errors.phoneNumber}
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
                {customerToEdit ? "Editar" : "Crear"}
              </Button>
            </Group>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default AddOrEditCustomer;
