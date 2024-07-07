import {
  Box,
  Button,
  Center,
  Group,
  Image,
  Text,
  TextInput,
  Loader,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import logoImg from "../../assets/logos/Logo Vertical-Full Color.png";
import authService from "../../services/auth/auth.service";
import { useAuthStore } from "../../common/store/session.store";
import { useNavigate } from "react-router-dom";

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setClaims } = useAuthStore();
  const navigate = useNavigate();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      setIsLoading(true);
      const data = await authService.login({
        email: values.email,
        password: values.password,
      });
      setClaims(data.value);
      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Center h={600}>
        <Image w={420} h={290} src={logoImg} alt="Web Shopping" />
      </Center>
      <Box maw={740} mx="auto" style={{ marginTop: "-7rem" }}>
        <form onSubmit={form.onSubmit(handleLogin)}>
          <TextInput
            withAsterisk
            label="Correo"
            placeholder="your@email.com"
            {...form.getInputProps("email")}
          />
          <TextInput
            withAsterisk
            label="Contraseña"
            placeholder="**********"
            mt="md"
            type="password"
            {...form.getInputProps("password")}
          />
          <Group justify="flex-end" mt="md">
            <Text fz="14px" c="#CF8146" fw={600}>
              Olvidaste tu contraseña?
            </Text>
          </Group>
          <Group mt="md">
            <Button
              fullWidth
              variant="filled"
              color="#CF8146"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? <Loader size="sm" /> : "Iniciar sesión"}
            </Button>
          </Group>
        </form>
      </Box>
    </>
  );
};

export default LoginForm;
