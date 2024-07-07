import {
  Box,
  Button,
  Group,
  Menu,
  Table,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconDotsVertical, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BranchResponseDto } from "../../../../models/branch/branch.model";
import { DeleteBranchModal } from "../DeleteModal";

interface BranchesTableProp {
  elements: BranchResponseDto[];
}

const BranchesTable = ({ elements }: BranchesTableProp) => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const rows = elements.map((element) => (
    <Table.Tr key={element.name}>
      <Table.Td>
        <Group
          ml={17}
          onClick={() => {
            navigate(`/sucursal/detalle/${element.id}`);
          }}
          style={{ cursor: "pointer" }}
        >
          <ThemeIcon
            size="xl"
            radius="md"
            variant="gradient"
            gradient={{ deg: 0, from: "pink", to: "orange" }}
          >
            {element.name.charAt(0).toUpperCase()}
          </ThemeIcon>
          <Box>
            <Title mt={17} order={5}>
              {" "}
              {element.name}
            </Title>
            <Text c="dimmed" size="sm" mt={5} mb={15}>
              {element.ownerName}
            </Text>
          </Box>
        </Group>
      </Table.Td>
      <Table.Td>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <Button ml={-99} variant="transparent">
              <IconDotsVertical size={25} />
            </Button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Application</Menu.Label>
            <Menu.Item
              onClick={() => {
                setOpenModal(!openModal);
              }}
              leftSection={<IconTrash />}
              rightSection={
                <Text size="xs" c="dimmed">
                  DEL
                </Text>
              }
            >
              Eliminar
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Table.Td>
      <DeleteBranchModal
        branchId={element.id}
        opened={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
      />
    </Table.Tr>
  ));
  return (
    <Table highlightOnHover mt={50} withTableBorder>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
};

export default BranchesTable;
