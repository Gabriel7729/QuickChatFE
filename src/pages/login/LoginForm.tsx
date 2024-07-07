import {
  Button,
  Text,
  TextInput,
  Loader,
  Anchor,
  Paper,
  PasswordInput,
  Title,
  Box,
  Checkbox,
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import authService from "../../services/auth/auth.service";
import { useAuthStore } from "../../common/store/session.store";
import { useNavigate } from "react-router-dom";

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const { setClaims } = useAuthStore();
  const navigate = useNavigate();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
      name: "",
      lastName: "",
      phoneNumber: "",
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

  const handleSignup = async (values: { email: string; password: string; name: string; lastName: string; phoneNumber: string }) => {
    try {
      setIsLoading(true);
      const data = await authService.signUp({
        name: values.name,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        phoneNumber: values.phoneNumber,
      });
      setClaims(data.value);
      navigate("/");
    } catch (error: any) {
      console.error("Signup error:", error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box style={{ width: "100%", maxWidth: '520px', margin: 'auto' }}>
      <Title ta="center">Welcome to QuickChat</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        {isSignup ? 'Already have an account? ' : 'Do not have an account yet? '}
        <Anchor size="sm" component="button" onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? 'Sign in' : 'Create account'}
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(isSignup ? handleSignup : handleLogin)}>
          {isSignup && (
            <>
              <TextInput
                label="Name"
                placeholder="Your name"
                required
                {...form.getInputProps("name")}
              />
              <TextInput
                label="Last Name"
                placeholder="Your last name"
                required
                mt="md"
                {...form.getInputProps("lastName")}
              />
              <TextInput
                label="Phone Number"
                placeholder="Your phone number"
                required
                mt="md"
                {...form.getInputProps("phoneNumber")}
              />
            </>
          )}
          <TextInput
            label="Email"
            placeholder="your@email.com"
            required
            mt={isSignup ? "md" : 0}
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            {...form.getInputProps("password")}
          />
          {!isSignup && (
            <Group justify="space-between" mt="lg">
              <Checkbox label="Remember me" />
              {/* TODO: Si da el tiempo implementar Forgot Password */}
              {/* <Anchor component="button" size="sm">
                Forgot password?
              </Anchor> */}
            </Group>
          )}
          <Button fullWidth mt="xl" type="submit" disabled={isLoading}>
            {isLoading ? <Loader size="sm" /> : isSignup ? "Sign up" : "Sign in"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginForm;
