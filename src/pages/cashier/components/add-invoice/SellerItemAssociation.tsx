import {
  Grid,
  Accordion,
  Select,
  Box,
  Group,
  Checkbox,
  Button,
  rem,
  Text,
} from "@mantine/core";
import { IconUser, IconUserPlus, IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { PacaResponseDto } from "../../../../models/paca/paca.model";
import { UserResponseDto } from "../../../../models/user/user.model";
import { FormikProps } from "formik";
import { ItemResponseDto } from "../../../../models/item/item.model";

interface Item {
  pacaId: string;
  itemId: string;
  quantity: number;
  price: number;
  userId: string | null;
}

interface SellerItemAssociationProps {
  values: Item[];
  employees: UserResponseDto[];
  pacas: PacaResponseDto[];
  items: ItemResponseDto[];
  selectedInvoiceType: string;
  setFieldValue: FormikProps<any>["setFieldValue"];
  onResetForm: any[];
}

const SellerItemAssociation: React.FC<SellerItemAssociationProps> = ({
  values,
  employees,
  pacas,
  items,
  selectedInvoiceType,
  setFieldValue,
  onResetForm,
}) => {
  const iconStyle = { width: rem(20), height: rem(20) };
  const [sellers, setSellers] = useState<string[]>([]);

  useEffect(() => {
    resetSellers();
  }, [onResetForm]);

  const resetSellers = () => {
    setSellers([]);
  };

  const handleSellerChange = (value: string | null, sellerIndex: number) => {
    const newSellers = [...sellers];
    newSellers[sellerIndex] = value ?? "";
    setSellers(newSellers);
  };

  const handleItemCheckboxChange = (
    sellerIndex: number,
    itemIndex: number,
    checked: boolean
  ) => {
    setFieldValue(
      `${getFieldArrayName()}.${itemIndex}.userId`,
      checked ? sellers[sellerIndex] : null
    );
  };

  const handleAddSeller = () => {
    setSellers([...sellers, ""]);
  };

  const handleRemoveSeller = (sellerIndex: number) => {
    const sellerId = sellers[sellerIndex];
    const newSellers = sellers.filter((_, index) => index !== sellerIndex);
    clearSellerItems(sellerId);
    setSellers(newSellers);
  };

  const clearSellerItems = (sellerId: string) => {
    values.forEach((item, index) => {
      if (item.userId === sellerId) {
        setFieldValue(`${getFieldArrayName()}.${index}.userId`, null);
      }
    });
  };

  const getEmployeeOptions = () => {
    return (
      employees?.map((employee) => ({
        value: employee.id,
        label: `${employee.name} ${employee.lastName}`,
      })) || []
    );
  };

  const getFieldArrayName = () => {
    return selectedInvoiceType === "Paca"
      ? "invoicePacaDetails"
      : "invoiceItemDetails";
  };

  const getItemLabel = (item: Item) => {
    if (selectedInvoiceType === "Paca") {
      const paca = pacas?.find((paca) => paca.id === item.pacaId);
      return `Paca: ${paca?.name ?? "No name"}`;
    } else {
      const itemDetail = items?.find(
        (itemDetail) => itemDetail.id === item.itemId
      );
      return `Artículo: ${itemDetail?.name ?? "No name"}`;
    }
  };

  const isItemChecked = (item: Item, sellerId: string) => {
    return item.userId === sellerId;
  };

  const isItemDisabled = (item: Item, sellerId: string) => {
    return (
      !isItemChecked(item, sellerId) &&
      values.some((itm) => itm.userId === sellerId && itm.userId !== sellerId)
    );
  };

  const renderItems = (sellerIndex: number) => {
    if (pacas.length === 0 && items.length === 0) {
      return <Text>No hay pacas ni items disponibles.</Text>;
    }
    return values.map((item, itemIndex) => (
      <Checkbox
        key={`item-checkbox}` + itemIndex}
        label={getItemLabel(item)}
        checked={isItemChecked(item, sellers[sellerIndex])}
        onChange={(event) =>
          handleItemCheckboxChange(
            sellerIndex,
            itemIndex,
            event.currentTarget.checked
          )
        }
        disabled={isItemDisabled(item, sellers[sellerIndex])}
      />
    ));
  };

  return (
    <Grid.Col span={12}>
      <Accordion variant="contained" defaultValue="Sellers">
        {sellers.map((_, sellerIndex) => (
          <Accordion.Item
            value={`Seller-${sellerIndex}`}
            key={`seller-}` + sellerIndex}
          >
            <Accordion.Control
              icon={<IconUser style={{ width: 20, height: 20 }} />}
            >
              Vendedor {sellerIndex + 1}
            </Accordion.Control>
            <Accordion.Panel>
              <Grid>
                <Grid.Col span={6}>
                  <Select
                    data={getEmployeeOptions()}
                    placeholder="Seleccione un vendedor"
                    onChange={(value) => handleSellerChange(value, sellerIndex)}
                    clearable
                    allowDeselect
                    searchable
                    value={sellers[sellerIndex] || ""}
                  />
                </Grid.Col>
                <Grid.Col
                  span={6}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Button
                    variant="subtle"
                    color="red"
                    onClick={() => handleRemoveSeller(sellerIndex)}
                    leftSection={<IconTrash style={iconStyle} />}
                  >
                    Remover Vendedor
                  </Button>
                </Grid.Col>
                {sellers[sellerIndex] && (
                  <Grid.Col span={12}>
                    <Box mt="md">
                      <Group>{renderItems(sellerIndex)}</Group>
                    </Box>
                  </Grid.Col>
                )}
              </Grid>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
        <Box mt="xs">
          <Button
            variant="transparent"
            color="#085b68"
            size="md"
            mt={"sm"}
            onClick={handleAddSeller}
            leftSection={<IconUserPlus style={iconStyle} />}
          >
            Agregar Vendedor
          </Button>
        </Box>
      </Accordion>
    </Grid.Col>
  );
};

export default SellerItemAssociation;
