import { useEffect, useState } from "react";
import { Button, Text, Card, Center, Title, Space, TextInput, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { SendOtpDto, ValidateOtpDto } from "../../models/validation/validation.model";
import validationService from "../../services/validation/validation.service";
import { useAuthStore } from "../../common/store/session.store";
import { useNavigate } from "react-router-dom";

export const OtpValidationPage = () => {
  const { claims, setEmailValidated } = useAuthStore();
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpValidated, setIsOtpValidated] = useState(false);
  const email = claims?.email!;

  useEffect(() => {
    if (!claims) {
      navigate("/login");
    }
  }, [claims, navigate]);

  const handleSendOtp = async () => {
    try {
      notifications.show({
        id: "send-otp",
        message: "Sending OTP...",
        color: "blue",
        loading: true,
        autoClose: false,
      });

      const sendOtp: SendOtpDto = {
        sentTo: email,
      };

      await validationService.sendOtp(sendOtp);
      setIsOtpSent(true);

      notifications.update({
        id: "send-otp",
        message: `OTP sent to ${email} successfully`,
        color: "green",
        icon: <IconCheck />,
        loading: false,
        autoClose: true,
      });
    } catch (error) {
      notifications.update({
        id: "send-otp",
        message: `Failed to send OTP to ${email}`,
        color: "red",
        icon: <IconX />,
        loading: false,
        autoClose: true,
      });
      console.error(error);
    }
  };

  const handleValidateOtp = async () => {
    try {
      notifications.show({
        id: "validate-otp",
        message: "Validating OTP...",
        color: "blue",
        loading: true,
        autoClose: false,
      });

      const validateOtp: ValidateOtpDto = {
        sentTo: email,
        code: otp,
      };

      const response = await validationService.validateOtp(validateOtp);

      if (!response.value.isSuccess) {
        console.log("Failed to validate OTP", response.value.message);
        throw new Error(response.value.message);
      }

      setIsOtpValidated(true);
      setEmailValidated();

      notifications.update({
        id: "validate-otp",
        message: "OTP validated successfully",
        color: "green",
        icon: <IconCheck />,
        loading: false,
        autoClose: true,
      });

      setTimeout(() => {
        navigate("/chats");
      }, 2000);
    } catch (error) {
      notifications.update({
        id: "validate-otp",
        message: "Failed to validate OTP",
        color: "red",
        icon: <IconX />,
        loading: false,
        autoClose: true,
      });
      setOtp("");
      console.error(error);
    }
  };

  const handleDoItLater = () => {
    document.cookie = "notValidateEmailForNow=false; path=/";
    navigate("/chats");
  };

  return (
    <Center style={{ height: "100vh" }}>
      <Card shadow="md" p="xl" radius="md" style={{ width: 400, textAlign: "center" }}>
        <Title order={2}>Verify your email address</Title>
        <Space h="md" />
        <Text c="dimmed">
          {isOtpSent
            ? `Enter the OTP sent to ${email}`
            : "Please verify this email address by clicking the button below"}
        </Text>
        <Space h="md" />
        {!isOtpSent ? (
          <Stack gap="md">
            <Button fullWidth onClick={handleSendOtp}>
              Send OTP
            </Button>
            <Button variant="outline"fullWidth onClick={handleDoItLater}>
              Do it later
            </Button>
          </Stack>
        ) : !isOtpValidated ? (
          <>
            <TextInput
              label="OTP"
              placeholder="Enter the OTP"
              value={otp}
              onChange={(event: any) => setOtp(event.currentTarget.value)}
              required
            />
            <Space h="md" />
            <Button fullWidth onClick={handleValidateOtp}>
              Validate OTP
            </Button>
          </>
        ) : (
          <Text c="green">OTP has been validated successfully!</Text>
        )}
      </Card>
    </Center>
  );
};

export default OtpValidationPage;
