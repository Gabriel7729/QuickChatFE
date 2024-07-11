import { Center } from "@mantine/core";
import LoginForm from "./LoginForm";

export const Unauthorized = () => {
  return (
    <Center style={{ height: "100vh" }}>
      <LoginForm />
    </Center>
  );
};

export default Unauthorized;