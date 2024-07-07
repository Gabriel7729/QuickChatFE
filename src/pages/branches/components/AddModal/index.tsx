import {
  Center,
  Container,
  Modal,
  Text
} from "@mantine/core";
import AddBranchForm from "../../../../components/add-branch-form";
import { BranchResponseDto } from "../../../../models/branch/branch.model";

interface AddModalProps {
  opened: boolean;
  close: () => void;
  existingBranch: BranchResponseDto | undefined;
}

const AddModal = ({ opened, close, existingBranch }: AddModalProps) => {
  return (
    <Modal
      size={"50rem"}
      opened={opened}
      onClose={close}
      title={
        <Center>
          <Text c={"#3D7E89"} fw={600}>
            Agregar nueva sucursal
          </Text>
        </Center>
      }
    >
      <Container>
        <Text fw={600} fz={15} c={"#F18C3C"} mb={20}>
          Información general
        </Text>
        <AddBranchForm closeModal={close} existingBranch={existingBranch} />
      </Container>
    </Modal>
  );
};

export default AddModal;
