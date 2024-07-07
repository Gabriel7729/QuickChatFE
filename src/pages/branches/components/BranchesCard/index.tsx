import { Button, Grid, Menu, Paper, Text, ThemeIcon } from "@mantine/core";
import { IconDotsVertical, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BranchResponseDto } from "../../../../models/branch/branch.model";
import { DeleteBranchModal } from "../DeleteModal";
import classes from "./CardGradient.module.css";

interface BranchesCardProp {
  elements: BranchResponseDto[];
}

const BranchesCard = ({ elements }: BranchesCardProp) => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState<boolean>(false);
  return (
    <Grid gutter="xl">
      {elements.map((element) => (
        <Grid.Col span={3} key={element.name}>
          <Paper withBorder radius="md" className={classes.card}>
            <Grid>
              <Grid.Col
                span={10}
                onClick={() => {
                  navigate(`/sucursal/detalle/${element.id}`);
                }}
              >
                <ThemeIcon
                  size="xl"
                  radius="md"
                  variant="gradient"
                  gradient={{ deg: 0, from: "pink", to: "orange" }}
                >
                  {element.name.charAt(0).toUpperCase()}
                </ThemeIcon>
              </Grid.Col>
              <Grid.Col span={1}>
                <Menu shadow="md" width={200}>
                  <Menu.Target>
                    <Button variant="transparent">
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
              </Grid.Col>
            </Grid>
            <Text
              size="xl"
              fw={500}
              mt="md"
              onClick={() => {
                navigate(`/sucursal/detalle/${element.id}`);
              }}
            >
              {element.name}
            </Text>
          </Paper>
          <DeleteBranchModal
            branchId={element.id}
            opened={openModal}
            onClose={() => {
              setOpenModal(false);
            }}
          />
        </Grid.Col>
      ))}
    </Grid>
  );
};

export default BranchesCard;
