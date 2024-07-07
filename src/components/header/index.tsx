import {
  Avatar,
  Badge,
  Group,
  Menu,
  Select,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { IconLogout, IconSettings } from "@tabler/icons-react";
import classes from "./Header.module.css";
import { useAuthStore } from "../../common/store/session.store";
import { getFirstLetter } from "../../common/utils/utils";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import authService from "../../services/auth/auth.service";
import branchService from "../../services/branch/branch.service";
import { BranchResponseDto } from "../../models/branch/branch.model";

interface DashboardProps {
  title: string;
  link: string;
}
export const Header = ({ title, link }: DashboardProps) => {
  const { logout, claims, setClaims, setBranchSelected } = useAuthStore();
  const navigate = useNavigate();
  const [branchesData, setBranchesData] = useState<BranchResponseDto[] | null>(null);

  useEffect(() => {
    const fetchBranches = async () => {
      if (claims && claims.role !== "Admin") {
        try {
          const { value } = await branchService.getList(`/User/${claims.userId}`);
          setBranchesData(value);
          setBranchSelected(value.find((branch) => branch.id === claims.branchId)!);
        } catch (error) {
          console.log("Error fetching branches", error);
        }
      }
    };

    fetchBranches();
  }, [claims]);

  const handleChangeBranch = async (branchId: string) => {  
    const claims = await authService.changeBranch(branchId);
    setClaims(claims.value);
    setBranchSelected(branchesData?.find((branch) => branch.id === branchId)!);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <Group>
        <UnstyledButton
          className="noFocusOutline"
          color="#F28D38"
          onClick={() => {
            navigate(link);
          }}
        >
          <Title size="h4" style={{ color: "#F28D38" }}>
            {title}
          </Title>
        </UnstyledButton>
        {branchesData && branchesData.length > 1 && (
          <Select
          data={branchesData.map((branch) => ({
            value: branch.id,
            label: branch.name,
          })) as any}
          value={claims?.branchId}
          onChange={(_value) => handleChangeBranch(_value!)}
        />
        )}
      </Group>
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <UnstyledButton className={classes.user}>
            <Group wrap="nowrap">
              <div>
                <Group>
                  <Text fz="8px" tt="uppercase" fw={700} c="dimmed">
                    {claims?.userName}
                  </Text>
                  <Badge
                    variant="light"
                    size="xs"
                    color="green"
                    style={{ marginLeft: "-0.5rem" }}
                  >
                    {claims?.role}
                  </Badge>
                </Group>

                <Text fz="10px" fw={500} className={classes.name}>
                  {claims?.email}
                </Text>
              </div>
              <Avatar
                tt="uppercase"
                variant="filled"
                color="rgba(241, 136, 53, 1)"
                radius="sm"
              >
                {getFirstLetter(claims?.userName!)}
              </Avatar>
            </Group>
          </UnstyledButton>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Usuario</Menu.Label>
          <Menu.Item onClick={() => {navigate("/usuario/cuenta")}} leftSection={<IconSettings stroke={1.3} />}>
            <Text size="sm">Configuración</Text>
          </Menu.Item>
          <Menu.Divider />
          <Menu.Label>Otros</Menu.Label>
          <Menu.Item
            color="red"
            leftSection={<IconLogout stroke={1.3} />}
            onClick={handleLogout}
          >
            <Text size="sm">Cerrar Sesión</Text>
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};

export default Header;
