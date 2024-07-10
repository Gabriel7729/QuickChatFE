import { Navigate } from "react-router-dom";
import { Center, Loader } from "@mantine/core";
import { useAuthStore } from "../../common/store/session.store";
export const PublicRoutes = ({ children }: any) => {
  
  const isLoading = false;
  const { claims } = useAuthStore();
  if (isLoading)
    return (
      <Center className="center-div">
        <Loader />
      </Center>
    );

  return !claims?.token ? children : <Navigate to="/chats" />;
};

export default PublicRoutes;
