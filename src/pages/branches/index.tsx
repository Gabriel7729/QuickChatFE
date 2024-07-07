import { Box, Button, Grid, Input, Loader, Text, Title } from "@mantine/core";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import BranchesCard from "./components/BranchesCard";
import BranchesTable from "./components/Table/branchesTable";
import { useDisclosure } from "@mantine/hooks";
import AddModal from "./components/AddModal";
import { BranchResponseDto } from "../../models/branch/branch.model";
import { useEffect, useState } from "react";
import branchService from "../../services/branch/branch.service";
import { useAllBranches } from "../../hooks/branch/branch.hooks";
export const Branches = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const { data } = useAllBranches(0, 0);
  const [branches, setBranches] = useState<BranchResponseDto[] | undefined>(
    data?.value.items
  );
  useEffect(() => {
    const getBranches = async () => {
      var result = await branchService.getPaginated("Paginated?PageNumber=0");
      setBranches(result.value.items);
    };
    getBranches();
  }, []);
  return (
    <Box>
      {branches === undefined ? (
        <Loader />
      ) : (
        <>
          <Grid>
            <Grid.Col span={10}>
              <Title order={3}>Sucursales</Title>
              <Text c="dimmed" size="sm" mt={5} mb={15}>
                Alrededor de {branches.length} surucsales
              </Text>
            </Grid.Col>
            <Grid.Col span={2}>
              <Box style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  onClick={open}
                  leftSection={<IconPlus size={20} />}
                  mb={7}
                  radius={1}
                >
                  Agregar
                </Button>
              </Box>
              <Input
                placeholder="Buscar"
                leftSection={<IconSearch size={16} />}
              />
            </Grid.Col>
          </Grid>
          <BranchesCard elements={branches} />
          <BranchesTable elements={branches} />
          <AddModal existingBranch={undefined} opened={opened} close={close} />
        </>
      )}
    </Box>
  );
};

export default Branches;
