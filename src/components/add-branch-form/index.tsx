import { Formik, Form } from "formik";
import {
  Box,
  Button,
  Flex,
  Grid,
  Group,
  Select,
  Text,
  TextInput,
  Autocomplete,
  AutocompleteProps,
  Avatar,
} from "@mantine/core";

import branchService from "../../services/branch/branch.service";
import {
  BranchRequest,
  BranchResponseDto,
} from "../../models/branch/branch.model";
import { useEffect, useState } from "react";
import { UserResponseDto } from "../../models/user/user.model";
import userService from "../../services/user/user.service";

import { z } from "zod";
import { zodResolver } from "../../common/utils/zod.utils";

const validationSchema = z.object({
  branchName: z
    .string()
    .min(3, "El nombre de la sucursal debe contener un mínimo de 3 caracteres")
    .max(
      30,
      "El nombre de la sucursal debe contener un máximo de 30 caracteres"
    )
    .regex(
      /^[a-zA-ZñÑ\u00C0-\u00FF ]+$/,
      "El nombre de la sucursal no puede contener caracteres especiales"
    ),
  province: z
    .string()
    .min(
      3,
      "La provincia de la sucursal debe contener un mínimo de 3 caracteres"
    )
    .max(
      30,
      "La provincia de la sucursal debe contener un máximo de 30 caracteres"
    )
    .regex(
      /^[a-zA-ZñÑ\u00C0-\u00FF ]+$/,
      "La provincia de la sucursal no puede contener caracteres especiales"
    ),
  address: z
    .string()
    .min(
      5,
      "La dirección de la sucursal debe contener un mínimo de 10 caracteres"
    )
    .max(
      150,
      "La dirección de la sucursal debe contener un máximo de 150 caracteres"
    ),
  supervisorEmail: z
    .string()
    .email("El correo del usuario no es válido")
    .min(1, "El correo del usuario es requerido"),
  supervisorFirstName: z
    .string()
    .min(3, "El nombre del usuario debe contener un mínimo de 3 caracteres")
    .max(30, "El nombre del usuario debe contener un máximo de 30 caracteres")
    .regex(
      /^[a-zA-ZñÑ\u00C0-\u00FF ]+$/,
      "El nombre del usuario no puede contener caracteres especiales"
    ),
  supervisorLastName: z
    .string()
    .min(3, "El apellido del usuario debe contener un mínimo de 3 caracteres")
    .max(30, "El apellido del usuario debe contener un máximo de 30 caracteres")
    .regex(
      /^[a-zA-ZñÑ\u00C0-\u00FF ]+$/,
      "El apellido del usuario no puede contener caracteres especiales"
    ),
  supervisorUsername: z
    .string()
    .min(3, "El nombre del usuario debe contener un mínimo de 3 caracteres")
    .max(30, "El nombre del usuario debe contener un máximo de 30 caracteres")
    .regex(
      /^[a-zA-ZñÑ\u00C0-\u00FF ]+$/,
      "El nombre del usuario no puede contener caracteres especiales"
    ),
  supervisorId: z
    .string()
    .min(
      11,
      "El número de identificación del usuario debe contener un mínimo de 11 caracteres"
    )
    .max(
      11,
      "El número de identificación del usuario debe contener un máximo de 11 caracteres"
    )
    .regex(
      /^[0-9]+$/,
      "El número de identificación del usuario debe contener solo números"
    ),
  supervisorPhone: z
    .string()
    .min(
      10,
      "El número de teléfono del usuario debe contener un mínimo de 10 caracteres"
    )
    .max(
      10,
      "El número de teléfono del usuario debe contener un máximo de 10 caracteres"
    )
    .regex(
      /^[0-9]+$/,
      "El número de teléfono del usuario debe contener solo números"
    ),
  supervisorAddress: z
    .string()
    .min(
      10,
      "La dirección del usuario debe contener un mínimo de 10 caracteres"
    )
    .max(
      150,
      "La dirección del usuario debe contener un máximo de 150 caracteres"
    ),
});

interface AddBranchFormProps {
  closeModal: () => void;
  existingBranch: BranchResponseDto | undefined;
}
interface BranchFormValues {
  branchName: string;
  province: string;
  address: string;
  supervisorEmail: string;
  supervisorFirstName: string;
  supervisorLastName: string;
  supervisorUsername: string;
  supervisorId: string;
  supervisorPhone: string;
  supervisorAddress: string;
}
const AddBranchForm = ({ closeModal, existingBranch }: AddBranchFormProps) => {
  const [users, setUsers] = useState<UserResponseDto[]>([]);
  const zodValidationScheme = zodResolver<BranchFormValues>(validationSchema);

  useEffect(() => {
    const getUsers = async () => {
      var result = await userService.getPaginated("Paginated?PageNumber=0");
      setUsers(result.value.items);
    };
    getUsers();
  }, []);

  const handleSubmit = (values: {
    branchName: string;
    province: string;
    address: string;
    supervisorEmail: string;
    supervisorFirstName: string;
    supervisorLastName: string;
    supervisorUsername: string;
    supervisorId: string;
    supervisorPhone: string;
    supervisorAddress: string;
  }) => {
    var user = users.find((user) => user.email === values.supervisorEmail);
    const userId = user ? user.id : null;
    var request: BranchRequest = {
      id: existingBranch?.id,
      name: values.branchName,
      address: values.address,
      province: values.province,
      user:
        userId === null
          ? {
              name: values.supervisorFirstName,
              lastName: values.supervisorLastName,
              userName: values.supervisorUsername,
              address: values.supervisorAddress,
              idNumber: values.supervisorId,
              phoneNumber: values.supervisorPhone,
              email: values.supervisorEmail,
              role: 0,
            }
          : null,
      userId: userId,
    };

    if (existingBranch === undefined) {
      /// Agregar toast con errores y validaciones
      branchService.post("", request).then(() => {
        closeModal();
      });
    } else {
      branchService.put("", request).then(() => {
        closeModal();
      });
    }
  };
  const renderAutocompleteOption: AutocompleteProps["renderOption"] = ({
    option,
  }) => (
    <Group gap="sm">
      <Avatar size={36} radius="xl" />
      <div>
        <Text size="sm">{option.value}</Text>
        <Text size="xs" opacity={0.5}>
          {
            users.find(
              (user) => `${user.name} ${user.lastName}` === option.value
            )?.email
          }
        </Text>
      </div>
    </Group>
  );
  const userFullNames = users.map((user) => `${user.name} ${user.lastName}`);
  return (
    <Formik
      initialValues={{
        branchName: existingBranch == undefined ? "" : existingBranch.name,
        province: existingBranch == undefined ? "" : existingBranch.province,
        address: existingBranch == undefined ? "" : existingBranch.address,
        supervisorEmail:
          existingBranch == undefined ? "" : existingBranch.user!.email,
        supervisorFirstName:
          existingBranch == undefined ? "" : existingBranch.user!.name,
        supervisorLastName:
          existingBranch == undefined ? "" : existingBranch.user!.lastName,
        supervisorUsername:
          existingBranch == undefined ? "" : existingBranch.user!.userName,
        supervisorId:
          existingBranch == undefined ? "" : existingBranch.user!.idNumber,
        supervisorPhone:
          existingBranch == undefined ? "" : existingBranch.user!.phoneNumber,
        supervisorAddress:
          existingBranch == undefined ? "" : existingBranch.user!.address,
      }}
      validate={zodValidationScheme}
      onSubmit={(values) => {
        handleSubmit(values);
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        setFieldValue,
        isSubmitting
      }) => (
        <Form>
          <Box>
            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label={
                    <Text c={"#3D7E89"} fw={600} fz={14}>
                      * Nombre
                    </Text>
                  }
                  placeholder="Nombre"
                  name="branchName"
                  value={values.branchName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.branchName && errors.branchName}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Select
                  label={
                    <Text c={"#3D7E89"} fw={600} fz={14}>
                      * Provincia
                    </Text>
                  }
                  placeholder="Seleccionar provincia"
                  data={[
                    "Azua",
                    "Baoruco",
                    "Barahona",
                    "Dajabón",
                    "Distrito Nacional",
                    "Duarte",
                    "El Seibo",
                    "Elías Piña",
                    "Espaillat",
                    "Hato Mayor",
                    "Hermanas Mirabal",
                    "Independencia",
                    "La Altagracia",
                    "La Romana",
                    "La Vega",
                    "María Trinidad Sánchez",
                    "Monseñor Nouel",
                    "Monte Cristi",
                    "Monte Plata",
                    "Pedernales",
                    "Peravia",
                    "Puerto Plata",
                    "Samaná",
                    "San Cristóbal",
                    "San José de Ocoa",
                    "San Juan",
                    "San Pedro de Macorís",
                    "Sánchez Ramírez",
                    "Santiago",
                    "Santiago Rodríguez",
                    "Santo Domingo",
                    "Valverde",
                  ]}
                  value={values.province}
                  name="province"
                  onChange={(value) =>
                    handleChange({ target: { name: "province", value } })
                  }
                  onBlur={handleBlur}
                  error={touched.province && errors.province}
                />
              </Grid.Col>
            </Grid>
            <TextInput
              mt={20}
              label={
                <Text c={"#3D7E89"} fw={600} fz={14}>
                  * Dirección
                </Text>
              }
              placeholder="Dirección"
              name="address"
              value={values.address}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.address && errors.address}
            />
            <Text fw={600} fz={15} c={"#F18C3C"} mt={30} mb={20}>
              Información del supervisor
            </Text>
            <Autocomplete
              mb={20}
              label={
                <Text c={"#3D7E89"} fw={600} fz={14}>
                  * Buscar supervisor existente
                </Text>
              }
              renderOption={renderAutocompleteOption}
              placeholder="Pick value or enter anything"
              data={userFullNames}
              maxDropdownHeight={200}
              onChange={(value) => {
                const selectedUser = users.find(
                  (user) => `${user.name} ${user.lastName}` === value
                );
                if (selectedUser) {
                  setFieldValue("supervisorEmail", selectedUser.email);
                  setFieldValue("supervisorFirstName", selectedUser.name);
                  setFieldValue("supervisorLastName", selectedUser.lastName);
                  setFieldValue("supervisorUsername", selectedUser.userName);
                  setFieldValue("supervisorId", selectedUser.idNumber);
                  setFieldValue("supervisorPhone", selectedUser.phoneNumber);
                  setFieldValue("supervisorAddress", selectedUser.address);
                }
              }}
            />
            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  mb={20}
                  label={
                    <Text c={"#3D7E89"} fw={600} fz={14}>
                      * Correo
                    </Text>
                  }
                  placeholder="Correo"
                  name="supervisorEmail"
                  value={values.supervisorEmail}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.supervisorEmail && errors.supervisorEmail}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  mb={20}
                  label={
                    <Text c={"#3D7E89"} fw={600} fz={14}>
                      * Username
                    </Text>
                  }
                  placeholder="Username"
                  name="supervisorUsername"
                  value={values.supervisorUsername}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    touched.supervisorUsername && errors.supervisorUsername
                  }
                />
              </Grid.Col>
            </Grid>
            <Grid mb={20}>
              <Grid.Col span={4}>
                <TextInput
                  label={
                    <Text c={"#3D7E89"} fw={600} fz={14}>
                      * Nombre
                    </Text>
                  }
                  placeholder="Nombre"
                  name="supervisorFirstName"
                  value={values.supervisorFirstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    touched.supervisorFirstName && errors.supervisorFirstName
                  }
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  label={
                    <Text c={"#3D7E89"} fw={600} fz={14}>
                      * Apellido
                    </Text>
                  }
                  placeholder="Apellido"
                  name="supervisorLastName"
                  value={values.supervisorLastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    touched.supervisorLastName && errors.supervisorLastName
                  }
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  label={
                    <Text c={"#3D7E89"} fw={600} fz={14}>
                      * Cédula
                    </Text>
                  }
                  placeholder="Cédula"
                  name="supervisorId"
                  value={values.supervisorId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.supervisorId && errors.supervisorId}
                />
              </Grid.Col>
            </Grid>
            <Grid mb={40}>
              <Grid.Col span={6}>
                <TextInput
                  label={
                    <Text c={"#3D7E89"} fw={600} fz={14}>
                      * Teléfono
                    </Text>
                  }
                  placeholder="Teléfono"
                  name="supervisorPhone"
                  value={values.supervisorPhone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.supervisorPhone && errors.supervisorPhone}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label={
                    <Text c={"#3D7E89"} fw={600} fz={14}>
                      * Dirección
                    </Text>
                  }
                  placeholder="Dirección"
                  name="supervisorAddress"
                  value={values.supervisorAddress}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.supervisorAddress && errors.supervisorAddress}
                />
              </Grid.Col>
            </Grid>
            <Flex justify="flex-end">
              <Group mt="md" flex={"flex-end"}>
                <Button onClick={closeModal} variant="outline" color="gray">
                  Cancelar
                </Button>
                <Button type="submit" loading={isSubmitting}>
                  Crear sucursal
                </Button>
              </Group>
            </Flex>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default AddBranchForm;
