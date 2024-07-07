import {
  Box,
  Card,
  CardSection,
  Flex,
  Modal,
  ScrollArea,
  Tabs,
  rem,
} from "@mantine/core";
import { IconBox, IconShirtSport } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import { CustomerResponseDto } from "../../../models/customer/customer.model";
import customerService from "../../../services/customer/customer.service";
import AddOrEditCustomer from "../components/AddOrEditCustomer";
import CustomerDetailSection from "../components/CustomerDetailSection";
import LastInvoicePacaFromCustomerTable from "../components/LastInvoicePacaFromCustomerTable";
import LastInvoiceItemFromCustomerTable from "../components/LastInvoiceItemFromCustomerTable";

export const CustomerDetailsPage = () => {
  const iconStyle = { width: rem(18), height: rem(18) };
  const [opened, { open, close }] = useDisclosure(false);
  const [customerData, setCustomerData] = useState<
    CustomerResponseDto | undefined
  >(undefined);
  const { id } = useParams();

  const fetchCustomer = useCallback(async () => {
    if (!customerData) {
      try {
        const { value } = await customerService.getById(`/${id}`);
        setCustomerData(value);
      } catch (error) {
        console.log("Error fetching Customer data", error);
      }
    }
  }, [id]);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  return (
    <div>
      <Card style={{ height: "calc(100vh - 97px)" }}>
        <CardSection style={{ padding: "2rem" }}>
          <Flex gap={"xl"}>
            {customerData && (
              <>
                <CustomerDetailSection
                  customerData={customerData}
                  openEditModal={() => {
                    open();
                  }}
                />

                <Box w={"100%"}>
                  <Tabs defaultValue="lastInvoicePacasFromCustomer">
                    <Tabs.List>
                      <Tabs.Tab
                        value="lastInvoicePacasFromCustomer"
                        leftSection={<IconBox style={iconStyle} />}
                      >
                        Facturas del Cliente de Pacas
                      </Tabs.Tab>
                      <Tabs.Tab
                        value="lastInvoiceItemsFromCustomer"
                        leftSection={<IconShirtSport style={iconStyle} />}
                      >
                        Facturas del Cliente de Ropas
                      </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="lastInvoicePacasFromCustomer">
                      <ScrollArea h={1000}>
                        <LastInvoicePacaFromCustomerTable id={id!} />
                      </ScrollArea>
                    </Tabs.Panel>
                    <Tabs.Panel value="lastInvoiceItemsFromCustomer">
                      <ScrollArea h={1000}>
                        <LastInvoiceItemFromCustomerTable id={id!} />
                      </ScrollArea>
                    </Tabs.Panel>
                  </Tabs>
                </Box>
              </>
            )}
          </Flex>
          <Modal
            opened={opened}
            onClose={close}
            size={"xl"}
            centered
            title={
              customerData
                ? "Editar la información del Cliente"
                : "Agregar un nuevo Cliente"
            }
          >
            <AddOrEditCustomer
              customerToEdit={customerData}
              onCustomerCreated={() => {
                close();
              }}
            />
          </Modal>
        </CardSection>
      </Card>
    </div>
  );
};

export default CustomerDetailsPage;
