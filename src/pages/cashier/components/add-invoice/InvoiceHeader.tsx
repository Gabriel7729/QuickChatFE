import React from 'react';
import { Card, Flex, Avatar, Text, Box, Select } from "@mantine/core";
import { getFirstLetter } from '../../../../common/utils/utils';
import { BranchResponseDto } from '../../../../models/branch/branch.model';

interface InvoiceHeaderProps {
  branchSelected: BranchResponseDto | null;
  selectedInvoiceType: string;
  setSelectedInvoiceType: (value: string) => void;
}

const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({
  branchSelected,
  selectedInvoiceType,
  setSelectedInvoiceType,
}) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Flex align={"center"} justify={"space-between"}>
        <Flex gap={"md"} mb={"xs"} align={"center"}>
          <Avatar
            size="90px"
            tt="uppercase"
            variant="filled"
            color="rgba(241, 136, 53, 1)"
            radius="200px"
          >
            {getFirstLetter(branchSelected?.name!)}
          </Avatar>
          <Flex gap={"xs"} direction={"column"}>
            <Text size="28px" fw={"500"}>
              {branchSelected?.name}
            </Text>
            <Text size="16px" fw={"500"} c={"#868E96"}>
              {branchSelected?.address}, {branchSelected?.province}
            </Text>
          </Flex>
        </Flex>
        <Box>
          <Select
            data={[
              { value: "Item", label: "Ropa" },
              { value: "Paca", label: "Paca" },
            ]}
            value={selectedInvoiceType}
            onChange={(value) => setSelectedInvoiceType(value!)}
          />
        </Box>
      </Flex>
    </Card>
  );
};

export default InvoiceHeader;
