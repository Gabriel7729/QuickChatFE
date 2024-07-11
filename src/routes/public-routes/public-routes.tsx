import { Navigate } from "react-router-dom";
import { Center, Loader } from "@mantine/core";
import { useAuthStore } from "../../common/store/session.store";
import { getCookieValue } from "../../common/utils/utils";

export const PublicRoutes = ({ children }: any) => {
  const isLoading = false;
  const { claims } = useAuthStore();

  if (isLoading)
    return (
      <Center className="center-div">
        <Loader />
      </Center>
    );

  if (!claims?.token) {
    return children;
  }

  const notValidateEmailForNow = getCookieValue('notValidateEmailForNow');
  if (!claims.isEmailValidated && notValidateEmailForNow === "false") {
    return <Navigate to="/chats" />;
  }

  if (!claims.isEmailValidated) {
    return <Navigate to="/validate/email/otp" />;
  }

  return <Navigate to="/chats" />;
};

export default PublicRoutes;
