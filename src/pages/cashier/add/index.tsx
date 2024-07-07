import { Box, Card, Grid, Text } from "@mantine/core";
import { useAuthStore } from "../../../common/store/session.store";
import { printInvoice } from "../../../common/utils/utils";
import { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import { zodResolver } from "../../../common/utils/zod.utils";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { PaymentMethod } from "../../../common/enums/invoice.enum";
import { useCustomerList } from "../../../hooks/customer/customer.hooks";
import { useUsersByBranchPaginated } from "../../../hooks/users/users.hook";
import { UserRole } from "../../../common/enums/user.enum";
import SellerItemAssociation from "../components/add-invoice/SellerItemAssociation";
import invoicePacaService from "../../../services/invoice/invoicePaca.service";
import PaymentInfoCard from "../components/add-invoice/PaymentInfoCard";
import InvoiceHeader from "../components/add-invoice/InvoiceHeader";
import InvoiceFormFields from "../components/add-invoice/InvoiceFormFields";
import { useResetSelects } from "../../../hooks/utils/select.hooks";
import invoiceItemService from "../../../services/invoice/invoiceItem.service";
import pacaService from "../../../services/paca/paca.service";
import { PacaResponseDto } from "../../../models/paca/paca.model";
import itemService from "../../../services/item/item.service";
import { ItemResponseDto } from "../../../models/item/item.model";
import InvoiceProductDetailsForm from "../components/add-invoice/InvoiceProductDetailsForm";
import {
  invoiceItemSchema,
  invoicePacaSchema,
} from "../../../common/constants/validation.scheme";
import { useParams } from "react-router-dom";

export const AddInvoicePage = () => {
  const { type } = useParams();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedInvoiceType, setSelectedInvoiceType] = useState<string>(
    type === "paca" ? "Paca" : "Item"
  );
  const [sellers, setSellers] = useState([]);
  const [pacas, setPacas] = useState<PacaResponseDto[]>([]);
  const [items, setItems] = useState<ItemResponseDto[]>([]);

  const { branchSelected, claims } = useAuthStore();
  const { addSelectRef, resetAllSelects } = useResetSelects();

  const { data: customers } = useCustomerList(branchSelected?.id!);
  const { data: employees } = useUsersByBranchPaginated(
    branchSelected?.id!,
    UserRole.EMPLOYEE,
    0,
    0
  );

  const zodValidateUser = zodResolver<any>(
    selectedInvoiceType === "Paca" ? invoicePacaSchema : invoiceItemSchema
  );

  useEffect(() => {
    const fetchProducts = async () => {
      if (selectedInvoiceType === "Paca") {
        try {
          const { value } = await pacaService.getList(
            `/Branch/${claims?.branchId}`
          );
          setPacas(value);
        } catch (error) {
          console.log("Error fetching Pacas", error);
        }
      } else {
        try {
          const { value } = await itemService.getList(
            `/Branch/${claims?.branchId}`
          );
          setItems(value);
        } catch (error) {
          console.log("Error fetching Items", error);
        }
      }
    };

    fetchProducts();
  }, [claims, selectedInvoiceType, setSelectedInvoiceType]);

  const handleSubmit = async (values: any) => {
    try {
      let response: Blob | null = null;

      notifications.show({
        id: "create-invoice",
        message: `Creando Factura...`,
        color: "blue",
        loading: true,
        autoClose: false,
      });

      setIsLoading(true);

      if (selectedInvoiceType === "Paca") {
        response = await invoicePacaService.createInvoice(values);
      } else {
        response = await invoiceItemService.createInvoice(values);
      }

      printInvoice(response);

      setIsLoading(false);
      notifications.update({
        id: "create-invoice",
        message: `Factura creada exitosamente.`,
        color: "green",
        icon: <IconCheck />,
        loading: false,
        autoClose: true,
      });
    } catch (error) {
      setIsLoading(false);
      notifications.update({
        id: "create-invoice",
        message: `Ha ocurrido un error creando la factura`,
        color: "red",
        icon: <IconX />,
        loading: false,
        autoClose: true,
      });

      console.error("Ha ocurrido un error creando la factura", error);
    }
  };

  const defaultValues: any = {
    paymentMethod: PaymentMethod.Efectivo,
    paidAmount: 0,
    discounts: 0,
    customerId: null,
    branchId: branchSelected?.id,
    cashierId: claims?.userId,
    invoicePacaDetails: [{ pacaId: "", quantity: 0, price: 0, userId: null }],
    invoiceItemDetails: [{ itemId: "", quantity: 0, price: 0, userId: null }],
  };

  return (
    <Box>
      <Formik
        initialValues={defaultValues}
        onSubmit={(values, { setSubmitting }) => {
          handleSubmit(values);
          setSubmitting(false);
        }}
        validate={zodValidateUser}
        validateOnChange={true}
        validateOnBlur={true}
        validateOnMount={true}
      >
        {({ handleSubmit, isValid, values, setFieldValue, resetForm }) => (
          <Form onSubmit={handleSubmit}>
            <Grid>
              <Grid.Col span={8}>
                <InvoiceHeader
                  branchSelected={branchSelected}
                  selectedInvoiceType={selectedInvoiceType}
                  setSelectedInvoiceType={setSelectedInvoiceType}
                />

                <Card mt={"lg"} shadow="sm" padding="lg" radius="md" withBorder>
                  <Text size="20px" fw={"500"} c={"#F18835"}>
                    Datos de la Factura
                  </Text>

                  <Grid.Col span={12}>
                    <InvoiceFormFields
                      branchSelected={branchSelected}
                      claims={claims}
                      customers={{ value: customers?.value! }}
                      setFieldValue={setFieldValue}
                      addSelectRef={addSelectRef}
                    />
                  </Grid.Col>

                  <Grid.Col mt={"sm"} span={12}>
                    <InvoiceProductDetailsForm
                      values={values}
                      pacas={{ value: pacas }}
                      items={{ value: items }}
                      selectedInvoiceType={selectedInvoiceType}
                      addSelectRef={addSelectRef}
                    />
                  </Grid.Col>

                  <Grid.Col span={12}>
                    <SellerItemAssociation
                      values={
                        selectedInvoiceType === "Paca"
                          ? values.invoicePacaDetails
                          : values.invoiceItemDetails
                      }
                      employees={employees?.value.items!}
                      pacas={pacas}
                      items={items}
                      selectedInvoiceType={selectedInvoiceType}
                      setFieldValue={setFieldValue}
                      onResetForm={sellers}
                    />
                  </Grid.Col>
                </Card>
              </Grid.Col>
              <Grid.Col span={4}>
                <PaymentInfoCard
                  values={values}
                  isValid={isValid}
                  isLoading={isLoading}
                  setFieldValue={setFieldValue}
                  selectedInvoiceType={selectedInvoiceType}
                  resetForm={() => {
                    resetForm();
                    setSellers([]);
                  }}
                  resetAllSelects={resetAllSelects}
                />
              </Grid.Col>
            </Grid>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default AddInvoicePage;
