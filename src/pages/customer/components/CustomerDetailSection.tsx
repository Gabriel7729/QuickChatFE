import React from "react";
import { Box, Avatar, Text, Flex, UnstyledButton } from "@mantine/core";
import {
  IconEdit,
  IconMail,
  IconId,
  IconPhone,
} from "@tabler/icons-react";
import { CustomerResponseDto } from "../../../models/customer/customer.model";
import {
  formatIdNumber,
  formatPhoneNumber,
  getFirstLetter,
} from "../../../common/utils/utils";

interface CustomerDetailSectionProps {
  customerData: CustomerResponseDto;
  openEditModal: () => void;
}

const CustomerDetailSection: React.FC<CustomerDetailSectionProps> = ({
  customerData,
  openEditModal,
}) => {
  const iconStyle = { width: "18px", height: "18px" };

  return (
    <Box w={"100%"} maw="300px">
      <Box p="lg" style={{ borderBottom: "1px solid #E8ECEF" }} maw="300px">
        <Avatar
          size="120px"
          mb="md"
          tt="uppercase"
          variant="filled"
          color="rgba(241, 136, 53, 1)"
          radius="200px"
        >
          {getFirstLetter(customerData.firstName)}
        </Avatar>
        <Text mt="xs" c="#085b68" fw="500" size="18px">
          {customerData.firstName} {customerData.lastName}
        </Text>
      </Box>
      <Box p="lg" style={{ borderBottom: "1px solid #E8ECEF" }} maw="300px">
        <Flex gap="xs" align="center" mt="md" mb="md">
          <Text c="#085b68" fw="500" size="16px">
            Información general
          </Text>
          <UnstyledButton onClick={openEditModal}>
            <IconEdit color="#085b68" style={iconStyle} />
          </UnstyledButton>
        </Flex>

        <Flex gap="md" direction="column">
          <Flex gap="xs" align="center">
            <IconMail color="#48494E" />
            <Text c="#48494E" fw="500" size="14px">
              {customerData.email}
            </Text>
          </Flex>
          <Flex gap="xs" align="center">
            <IconId color="#48494E" />
            <Text c="#48494E" fw="500" size="14px">
              {formatIdNumber(customerData.idNumber)}
            </Text>
          </Flex>
          <Flex gap="xs" align="center">
            <IconPhone color="#48494E" />
            <Text c="#48494E" fw="500" size="14px">
              {formatPhoneNumber(customerData.phoneNumber)}
            </Text>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default CustomerDetailSection;
