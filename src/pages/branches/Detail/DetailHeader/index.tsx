import { Box, Button, Grid, Group, Menu, Text, ThemeIcon } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconAt,
  IconLocation,
  IconPencil,
  IconTrash
} from "@tabler/icons-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { getFirstLetter } from "../../../../common/utils/utils";
import { BranchResponseDto } from "../../../../models/branch/branch.model";
import AddModal from "../../components/AddModal";
import { DeleteBranchModal } from "../../components/DeleteModal";
interface BranchDetailHeaderInterface {
  branch: BranchResponseDto;
}
export const BranchDetailHeader = ({ branch }: BranchDetailHeaderInterface) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { id } = useParams();

  return (
    <Grid>
      <Grid.Col span={{ base: 12, xs: 9 }}>
        <Box>
          <Group>
            <ThemeIcon
              size={90}
              radius={100}
              variant="gradient"
              gradient={{ deg: 0, from: "pink", to: "orange" }}
            >
              <Text fw={650} fz={35}>{getFirstLetter(branch.name).toUpperCase()}</Text>
            </ThemeIcon>
            <div>
              <Text fz={30} fw={600}>
                {branch.name}
              </Text>
              <Group>
                <Group wrap="nowrap" gap={10} mt={3}>
                  <IconAt stroke={1.5} size="1rem" />
                  <Text fz="xs" c="dimmed">
                    {branch.user?.email}
                  </Text>
                </Group>

                <Group wrap="nowrap" gap={10} mt={5}>
                  <IconLocation stroke={1.5} size="1rem" />
                  <Text fz="xs" c="dimmed">
                    {branch.address}
                  </Text>
                </Group>
              </Group>
            </div>
          </Group>
        </Box>
      </Grid.Col>
      <Grid.Col span={{ base: 12, xs: 3 }}>
        <Box style={{ display: "flex", justifyContent: "flex-end" }}>
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Button ml={-99} variant="light" radius={25}>
                Opciones
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Sucursal</Menu.Label>
              <Menu.Item leftSection={<IconPencil />} onClick={open}>
                Editar
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  setOpenModal(!openModal);
                }}
                leftSection={<IconTrash />}
              >
                Eliminar
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Box>
      </Grid.Col>
      <AddModal existingBranch={branch} opened={opened} close={close} />
      <DeleteBranchModal
        branchId={id!}
        opened={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
      />
    </Grid>
  );
};
