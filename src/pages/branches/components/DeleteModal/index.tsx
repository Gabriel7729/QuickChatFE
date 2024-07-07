import { Button, Checkbox, Group, Modal, Stack, Text } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import branchService from "../../../../services/branch/branch.service";

interface DeleteBranchModalProps {
  opened: boolean;
  onClose: () => void;
  branchId: string;
}

export function DeleteBranchModal({ opened, onClose, branchId }: DeleteBranchModalProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleConfirm = () => {
    setIsLoading(true);
    branchService.delete(branchId).then(() => {
      onClose();
      navigate("/");
      location.reload();
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group>
          <IconAlertTriangle size={24} color="red" />
          <Text fw={700}>Eliminar Sucursal</Text>
        </Group>
      }
      centered
    >
      <Stack>
        <Text fz={15}>
          ¿Seguro de que quieres borrar la sucursal? Esta acción no se puede
          deshacer.
        </Text>

        <Checkbox
          label="Estoy seguro de que quiero eliminar esta sucursal"
          checked={isConfirmed}
          onChange={(event) => setIsConfirmed(event.currentTarget.checked)}
        />

        <Group mt="xl">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button loading={isLoading} color="red" disabled={!isConfirmed} onClick={handleConfirm}>
            Eliminar
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
