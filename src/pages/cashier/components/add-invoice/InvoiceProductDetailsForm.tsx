import React from "react";
import {
  Table,
  ScrollArea,
  Button,
  Select,
  NumberInput,
  Tooltip,
  UnstyledButton,
  rem,
} from "@mantine/core";
import { Field, FieldArray } from "formik";
import { IconCirclePlus, IconTrash } from "@tabler/icons-react";
import { PacaResponseDto } from "../../../../models/paca/paca.model";
import { formatAmount } from "../../../../common/utils/amount.utils";
import { getErrorValidationMessage } from "../../../../common/utils/zod.utils";
import {
  ItemResponseDto,
  PriceConfigurationResponseDto,
} from "../../../../models/item/item.model";
import { WeekDay } from "../../../../common/enums/weekday.enum";

interface Item {
  itemId: string;
  pacaId: string;
  quantity: number;
  price: number;
  userId: string | null;
}

interface InvoiceProductDetailsProps {
  values: any;
  pacas: { value: PacaResponseDto[] };
  items: { value: ItemResponseDto[] };
  selectedInvoiceType: string;
  addSelectRef: (ref: any) => void;
}

const InvoiceProductDetailsForm: React.FC<InvoiceProductDetailsProps> = ({
  values,
  pacas,
  items,
  selectedInvoiceType,
  addSelectRef,
}) => {
  const iconStyle = { width: rem(20), height: rem(20) };

  const getSelectData = () => {
    if (selectedInvoiceType === "Paca") {
      return (
        pacas?.value?.map((paca: PacaResponseDto) => ({
          value: paca.id,
          label: paca.name,
          price: paca.price,
        })) || []
      );
    }
    if (selectedInvoiceType === "Item") {
      return (
        items?.value?.map((item: ItemResponseDto) => ({
          value: item.id,
          label: item.name,
        })) || []
      );
    }
    return [];
  };

  const getPriceFromItemConfiguration = (item: ItemResponseDto) => {
    return (
      item?.priceConfigurations.find(
        (config: PriceConfigurationResponseDto) =>
          config.weekDay === ((new Date().getDay() + 1) as WeekDay)
      )?.price ?? 0
    );
  };

  const disablePriceField = (itemId: string) => {
    if (selectedInvoiceType === "Paca") {
      return true;
    }

    const item = items?.value?.find(
      (item: ItemResponseDto) => item.id === itemId
    );
    const today = (new Date().getDay() + 1) as WeekDay;
    return item?.priceConfigurations.some(
      (config: PriceConfigurationResponseDto) => config.weekDay === today
    );
  };

  const getFieldArrayName = () => {
    return selectedInvoiceType === "Paca"
      ? "invoicePacaDetails"
      : "invoiceItemDetails";
  };

  const getFieldArrayValues = () => {
    return selectedInvoiceType === "Paca"
      ? values.invoicePacaDetails
      : values.invoiceItemDetails;
  };

  const handlePushNewItem = (push: (obj: any) => void) => {
    if (selectedInvoiceType === "Paca") {
      push({
        pacaId: "",
        quantity: 0,
        price: 0,
        userId: null,
      });
    } else {
      push({
        itemId: "",
        quantity: 0,
        price: 0,
        userId: null,
      });
    }
  };

  return (
    <FieldArray name={getFieldArrayName()}>
      {({ remove, push }) => (
        <>
          <ScrollArea h={getFieldArrayValues().length > 3 ? 250 : "auto"}>
            <Table stickyHeader withTableBorder highlightOnHover>
              <Table.Thead bg={"#F0F2F5"}>
                <Table.Tr c={"#085b68"}>
                  <Table.Th>
                    {selectedInvoiceType === "Paca" ? "Pacas" : "Ropas"}
                  </Table.Th>
                  <Table.Th>Cantidad</Table.Th>
                  <Table.Th>Precio por Unidad</Table.Th>
                  <Table.Th>Total</Table.Th>
                  <Table.Th></Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {getFieldArrayValues().map((item: Item, index: number) => (
                  <Table.Tr key={"Item" + index}>
                    <Table.Td p={"md"}>
                      <Field
                        name={`${getFieldArrayName()}.${index}.${
                          selectedInvoiceType === "Paca" ? "pacaId" : "itemId"
                        }`}
                      >
                        {({ field, form }: any) => (
                          <div ref={addSelectRef}>
                            <Select
                              {...field}
                              data={getSelectData()}
                              placeholder={
                                selectedInvoiceType === "Paca"
                                  ? "Seleccione una paca"
                                  : "Seleccione una ropa"
                              }
                              error={
                                form.touched.itemId && form.errors.itemId
                                  ? form.errors.itemId
                                  : undefined
                              }
                              onChange={(value) => {
                                if (selectedInvoiceType === "Paca") {
                                  const selectedPaca = pacas?.value?.find(
                                    (paca: PacaResponseDto) => paca.id === value
                                  );
                                  form.setFieldValue(
                                    `${getFieldArrayName()}.${index}.pacaId`,
                                    value
                                  );
                                  form.setFieldValue(
                                    `${getFieldArrayName()}.${index}.price`,
                                    selectedPaca?.price ?? 0
                                  );
                                } else if (selectedInvoiceType === "Item") {
                                  const selectedItem = items?.value?.find(
                                    (item: ItemResponseDto) => item.id === value
                                  );
                                  form.setFieldValue(
                                    `${getFieldArrayName()}.${index}.itemId`,
                                    value
                                  );
                                  form.setFieldValue(
                                    `${getFieldArrayName()}.${index}.price`,
                                    getPriceFromItemConfiguration(selectedItem!)
                                  );
                                }
                              }}
                              value={String(field.value)}
                              clearable
                              allowDeselect
                              searchable
                            />
                          </div>
                        )}
                      </Field>
                    </Table.Td>
                    <Table.Td p={"md"}>
                      <Field name={`${getFieldArrayName()}.${index}.quantity`}>
                        {({ field, form }: any) => (
                          <NumberInput
                            {...field}
                            placeholder="Ingrese la cantidad"
                            error={
                              form.touched.quantity && form.errors.quantity
                                ? getErrorValidationMessage(
                                    form.errors.quantity
                                  )
                                : undefined
                            }
                            onChange={(value) => {
                              form.setFieldValue(
                                `${getFieldArrayName()}.${index}.quantity`,
                                value
                              );
                            }}
                          />
                        )}
                      </Field>
                    </Table.Td>
                    <Table.Td p={"md"}>
                      <Field name={`${getFieldArrayName()}.${index}.price`}>
                        {({ field, form }: any) => (
                          <NumberInput
                            {...field}
                            placeholder="Ingrese el precio por unidad"
                            prefix="$"
                            thousandSeparator
                            error={
                              form.touched.price && form.errors.price
                                ? getErrorValidationMessage(form.errors.price)
                                : undefined
                            }
                            onChange={(value) => {
                              form.setFieldValue(
                                `${getFieldArrayName()}.${index}.price`,
                                value
                              );
                            }}
                            disabled={disablePriceField(item.itemId)}
                            hideControls
                          />
                        )}
                      </Field>
                    </Table.Td>
                    <Table.Td p={"md"}>
                      {formatAmount(item.quantity * item.price)}
                    </Table.Td>
                    <Table.Td>
                      <Tooltip label="Remover artículo">
                        <UnstyledButton
                          style={iconStyle}
                          className="noFocusOutline"
                          onClick={() => remove(index)}
                        >
                          <IconTrash color="#C92A2A" style={iconStyle} />
                        </UnstyledButton>
                      </Tooltip>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </ScrollArea>
          <Tooltip label="Agregar artículo">
            <Button
              variant="transparent"
              size="md"
              mt={"sm"}
              onClick={() => handlePushNewItem(push)}
              leftSection={<IconCirclePlus style={iconStyle} />}
            >
              Agregar artículo
            </Button>
          </Tooltip>
        </>
      )}
    </FieldArray>
  );
};

export default InvoiceProductDetailsForm;
