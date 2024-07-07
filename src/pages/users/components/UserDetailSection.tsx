import React from "react";
import { Box, Avatar, Text, Flex, UnstyledButton } from "@mantine/core";
import {
  IconEdit,
  IconMail,
  IconId,
  IconPhone,
  IconMapPin,
} from "@tabler/icons-react";
import { UserResponseDto } from "../../../models/user/user.model";
import {
  formatIdNumber,
  formatPhoneNumber,
  getFirstLetter,
} from "../../../common/utils/utils";
import { useNavigate } from "react-router-dom";
import { generateDistinctColors } from "../../../common/utils/color.utils";
import { useAuthStore } from "../../../common/store/session.store";

interface UserDetailSectionProps {
  userData: UserResponseDto;
  openEditModal: () => void;
}

const UserDetailSection: React.FC<UserDetailSectionProps> = ({
  userData,
  openEditModal,
}) => {
  const { claims } = useAuthStore();
  const navigate = useNavigate();
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
          {getFirstLetter(userData.name)}
        </Avatar>
        <Text mt="xs" c="#085b68" fw="500" size="18px">
          {userData.name} {userData.lastName}
        </Text>
        <Text mt="xs" fw="500" c="#48494E" size="14px">
          {userData.userName}
        </Text>
      </Box>
      <Box
        p="lg"
        style={{
          borderBottom: `${
            userData.branchesInfo.length > 0 ? "1px solid #E8ECEF" : ""
          }`,
        }}
        maw="300px"
      >
        <Flex gap="xs" align="center" mt="md" mb="md">
          <Text c="#085b68" fw="500" size="16px">
            Información general
          </Text>
          {claims?.role !== "CASHIER" && (
            <UnstyledButton onClick={openEditModal}>
              <IconEdit color="#085b68" style={iconStyle} />
            </UnstyledButton>
          )}
        </Flex>

        <Flex gap="md" direction="column">
          <Flex gap="xs" align="center">
            <IconMail color="#48494E" />
            <Text c="#48494E" fw="500" size="14px">
              {userData.email}
            </Text>
          </Flex>
          <Flex gap="xs" align="center">
            <IconId color="#48494E" />
            <Text c="#48494E" fw="500" size="14px">
              {formatIdNumber(userData.idNumber)}
            </Text>
          </Flex>
          <Flex gap="xs" align="center">
            <IconPhone color="#48494E" />
            <Text c="#48494E" fw="500" size="14px">
              {formatPhoneNumber(userData.phoneNumber)}
            </Text>
          </Flex>
          <Flex gap="xs" align="center">
            <IconMapPin color="#48494E" />
            <Text c="#48494E" fw="500" size="14px">
              {userData.address}
            </Text>
          </Flex>
        </Flex>
      </Box>
      <Box p="lg" maw="300px">
        {userData.branchesInfo?.length > 0 && (
          <Text c="#085b68" fw="500" size="16px">
            Sucursales
          </Text>
        )}
        <Flex mt="lg" direction="column">
          {userData.branchesInfo?.map((branch, index) => (
            <UnstyledButton
              key={`branchTeam` + index}
              onClick={() => {
                navigate(`/sucursales/${branch.id}`);
              }}
              className="clickable"
            >
              <Flex p="xs" gap="md" align="center">
                <Avatar
                  size="30px"
                  tt="uppercase"
                  className="notHoverable"
                  variant="filled"
                  color={generateDistinctColors(index + 1)[0]}
                  radius="200px"
                >
                  {getFirstLetter(branch.branchName)}
                </Avatar>
                <Flex gap="5px" direction="column">
                  <Text c="#48494E" fw="500" size="14px">
                    {branch.branchName}
                  </Text>
                  <Text c="#48494E" size="12px">
                    {branch.branchMembers} usuarios
                  </Text>
                </Flex>
              </Flex>
            </UnstyledButton>
          ))}
        </Flex>
      </Box>
    </Box>
  );
};

export default UserDetailSection;
