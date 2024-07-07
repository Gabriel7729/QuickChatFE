import React from "react";
import {
  Card,
  Grid,
  Select,
  NumberInput,
  Divider,
  Table,
  Text,
  Group,
  Button,
} from "@mantine/core";
import { Field, FormikProps, FormikState } from "formik";
import { IconCalendar } from "@tabler/icons-react";
import { PaymentMethod } from "../../../../common/enums/invoice.enum";
import {
  getEnumSelectOptions,
  formatValueSelectToEnum,
} from "../../../../common/utils/enum.utils";
import { DateInput } from "@mantine/dates";
import { formatDate } from "date-fns";
import { formatAmount } from "../../../../common/utils/amount.utils";
import { getErrorValidationMessage } from "../../../../common/utils/zod.utils";

interface PaymentInfoCardProps {
  values: any;
  isValid: boolean;
  isLoading: boolean;
  setFieldValue: FormikProps<any>["setFieldValue"];
  selectedInvoiceType: string;
  resetForm: (nextState?: Partial<FormikState<any>> | undefined) => void;
  resetAllSelects: () => void;
}

const PaymentInfoCard: React.FC<PaymentInfoCardProps> = ({
  values,
  isValid,
  isLoading,
  setFieldValue,
  selectedInvoiceType,
  resetForm,
  resetAllSelects,
}) => {
  const resetInvoice = () => {
    resetAllSelects();
    resetForm();
  };

  const getInvoiceDetails = () => {
    return selectedInvoiceType === "Paca"
      ? values.invoicePacaDetails
      : values.invoiceItemDetails;
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Text size="20px" fw={"500"} c={"#F18835"}>
        Información sobre la factura y pago
      </Text>
      <Grid mt={"md"} grow>
        <Grid.Col span={12}>
          <Field name="paymentMethod">
            {({ field, form }: any) => (
              <Select
                {...field}
                data={getEnumSelectOptions(PaymentMethod)}
                label="Método de Pago"
                placeholder="Seleccione un método de pago"
                error={
                  form.touched.paymentMethod && form.errors.paymentMethod
                    ? form.errors.paymentMethod
                    : undefined
                }
                onChange={(value) => {
                  setFieldValue(
                    "paymentMethod",
                    formatValueSelectToEnum(value!, PaymentMethod)
                  );
                }}
                value={String(field.value)}
                clearable
                allowDeselect
                searchable
                withAsterisk
              />
            )}
          </Field>
        </Grid.Col>
        <Grid.Col span={12}>
          <Field name="paidAmount">
            {({ field, form }: any) => (
              <NumberInput
                {...field}
                label="Monto Pagado"
                placeholder="Ingrese el monto pagado"
                prefix="$"
                thousandSeparator
                error={
                  form.touched.paidAmount && form.errors.paidAmount
                    ? getErrorValidationMessage(form.errors.paidAmount)
                    : undefined
                }
                onChange={(value) => {
                  setFieldValue("paidAmount", value);
                }}
                withAsterisk
                hideControls
              />
            )}
          </Field>
        </Grid.Col>
        <Grid.Col span={12}>
          <DateInput
            valueFormat="DD MMM YYYY"
            label="Fecha de Facturación"
            placeholder={formatDate(new Date(), "dd/MM/yyyy HH:mm a")}
            disabled={true}
            rightSection={<IconCalendar />}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Field name="discounts">
            {({ field, form }: any) => (
              <NumberInput
                {...field}
                label="Descuentos"
                placeholder="Ingrese el descuento"
                prefix="$"
                thousandSeparator
                error={
                  form.touched.discounts && form.errors.discounts
                    ? getErrorValidationMessage(form.errors.discounts)
                    : undefined
                }
                onChange={(value) => {
                  setFieldValue("discounts", value);
                }}
                hideControls
              />
            )}
          </Field>
        </Grid.Col>

        <Grid.Col span={12}>
          <Divider my="sm" />
          <Table withRowBorders={false}>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td fw={"500"} c={"#868E96"}>
                  SubTotal
                </Table.Td>
                <Table.Td ta={"right"} fw={"500"} c={"#868E96"}>
                  {formatAmount(
                    getInvoiceDetails().reduce(
                      (acc: number, item: any) =>
                        acc + item.quantity * item.price,
                      0
                    )
                  )}
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td fw={"500"} c={"#868E96"}>
                  Cambio a devolver
                </Table.Td>
                <Table.Td ta={"right"} fw={"500"} c={"#868E96"}>
                  {formatAmount(
                    values.paidAmount -
                      getInvoiceDetails().reduce(
                        (acc: number, item: any) =>
                          acc + item.quantity * item.price,
                        0
                      ) -
                      values.discounts
                  )}
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td pt={"md"}>
                  <Text size="lg" fw={"500"}>
                    Total
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text ta={"right"} size="lg" fw={"500"}>
                    {formatAmount(
                      getInvoiceDetails().reduce(
                        (acc: number, item: any) =>
                          acc + item.quantity * item.price,
                        0
                      ) - values.discounts
                    )}
                  </Text>
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </Grid.Col>
      </Grid>
      <Group mt="xl" justify="flex-end">
        <Button variant="outline" color="gray" onClick={resetInvoice}>
          Reiniciar Factura
        </Button>
        <Button
          disabled={!isValid}
          loading={isLoading}
          color={"#f18835"}
          type="submit"
        >
          Facturar
        </Button>
      </Group>
    </Card>
  );
};

export default PaymentInfoCard;
