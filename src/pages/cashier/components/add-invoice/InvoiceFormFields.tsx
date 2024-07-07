import React from "react";
import { Grid, TextInput, Select } from "@mantine/core";
import { Field, FormikProps } from "formik";
import { generateInvoiceNumber } from "../../../../common/utils/invoice.utils";
import { CustomerResponseDto } from "../../../../models/customer/customer.model";
import { BranchResponseDto } from "../../../../models/branch/branch.model";
import { LoginResponse } from "../../../../models/auth/auth.model";

interface InvoiceFormFieldsProps {
  branchSelected: BranchResponseDto | null;
  claims: LoginResponse | null;
  customers: { value: CustomerResponseDto[] };
  setFieldValue: FormikProps<any>["setFieldValue"];
  addSelectRef: (ref: any) => void;
}

const InvoiceFormFields: React.FC<InvoiceFormFieldsProps> = ({
  branchSelected,
  claims,
  customers,
  setFieldValue,
  addSelectRef,
}) => {
  return (
    <Grid mt={"lg"}>
      <Grid.Col span={6}>
        <TextInput
          label="Número de Factura (Preview)"
          placeholder={generateInvoiceNumber(branchSelected?.name!)}
          disabled={true}
        />
      </Grid.Col>
      <Grid.Col span={6}>
        <TextInput
          label="Nombre de Usuario (Cajero)"
          placeholder={claims?.userName}
          disabled={true}
        />
      </Grid.Col>

      <Grid.Col span={12}>
        <Field name="customerId">
          {({ field, form }: any) => (
            <div ref={addSelectRef}>
              <Select
                {...field}
                data={
                  customers?.value?.map((customer: CustomerResponseDto) => ({
                    value: customer.id,
                    label: customer.firstName + " " + customer.lastName,
                  })) || []
                }
                label="Cliente"
                placeholder="Seleccione un cliente"
                error={
                  form.touched.customerId && form.errors.customerId
                    ? form.errors.customerId
                    : undefined
                }
                onChange={(value) => {
                  setFieldValue("customerId", value);
                }}
                value={String(field.value)}
                clearable
                allowDeselect
                searchable
              />
            </div>
          )}
        </Field>
      </Grid.Col>
    </Grid>
  );
};

export default InvoiceFormFields;
