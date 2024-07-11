import React, { useState } from "react";
import { Button, Grid, PasswordInput, Text, Tabs } from "@mantine/core";
import { Formik, Form, Field } from "formik";
import { z } from "zod";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import userService from "../../../services/user/user.service"; // Adjust the path as needed
import { zodResolver } from "@mantine/form";
import { ChangePasswordDto } from "../../../models/user/user.model";

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, "Contraseña actual es requerida"),
    newPassword: z
      .string()
      .min(1, "Nueva contraseña es requerida")
      .min(8, "La nueva contraseña debe tener al menos 8 caracteres"),
    confirmNewPassword: z.string().min(1, "Confirmar contraseña es requerida"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Las contraseñas no coinciden",
  });

type PasswordSchema = z.infer<typeof passwordSchema>;

export interface PasswordChangeFormProps {
  userId: string;
}

const PasswordChangeForm: React.FC<PasswordChangeFormProps> = ({ userId }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const zodValidatePasswordRequest =
    zodResolver<ChangePasswordDto>(passwordSchema);

  const handleChangePassword = async (
    values: PasswordSchema,
    { resetForm }: { resetForm: () => void }
  ) => {
    try {
      notifications.show({
        id: "change-password",
        message: "Cambiando contraseña...",
        color: "blue",
        loading: true,
        autoClose: false,
      });
      setIsLoading(true);
      const response = await userService.changePassword(userId, values);
      if (response.isSuccess) {
        setIsLoading(false);
        notifications.update({
          id: "change-password",
          message: "Contraseña cambiada exitosamente",
          color: "green",
          icon: <IconCheck />,
          autoClose: true,
          loading: false,
        });
        resetForm();
      }
    } catch (error) {
      setIsLoading(false);
      notifications.update({
        id: "change-password",
        message: "Error al cambiar la contraseña",
        color: "red",
        icon: <IconX />,
        autoClose: true,
        loading: false,
      });
      console.error("Error changing password", error);
    }
  };

  return (
    <Formik
      initialValues={{
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      }}
      onSubmit={handleChangePassword}
      validate={zodValidatePasswordRequest}
      validateOnChange={true}
      validateOnBlur={true}
      validateOnMount={true}
    >
      {({ errors, touched, isValid }) => (
        <Form>
          <Grid mb={"sm"} maw={"400px"}>
            <Grid.Col span={12}>
              <Field
                as={PasswordInput}
                name="oldPassword"
                label="Contraseña actual"
                placeholder="Contraseña actual"
                withAsterisk
                error={touched.oldPassword && errors.oldPassword}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Field
                as={PasswordInput}
                name="newPassword"
                label="Nueva contraseña"
                placeholder="Nueva contraseña"
                withAsterisk
                error={touched.newPassword && errors.newPassword}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Field
                as={PasswordInput}
                name="confirmNewPassword"
                label="Confirmar contraseña"
                placeholder="Confirmar contraseña"
                withAsterisk
                error={touched.confirmNewPassword && errors.confirmNewPassword}
              />
            </Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={4}>
              <Button
                type="submit"
                disabled={!isValid}
                loading={isLoading}
                mt={"xs"}
                color={"#228BE6"}
              >
                Guardar
              </Button>
            </Grid.Col>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default PasswordChangeForm;
