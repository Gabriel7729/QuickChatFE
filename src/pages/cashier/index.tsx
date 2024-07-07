import { Tabs, Text, rem } from "@mantine/core";
import { IconShirtSport, IconPackage } from "@tabler/icons-react";
import PacaInvoiceTable from "./components/paca-invoice-table/PacaInvoiceTable";
import ClotheInvoiceTable from "./components/clothe-invoice-table/ClotheInvoiceTable";

export const Cashier = () => {
  const iconStyle = { width: rem(20), height: rem(20) };
  return (
    <div>
      <Text size="32px" fw={"500"} c={"#085b68"}>
        Facturas
      </Text>
      <Tabs color="#F18835" mt={"md"} defaultValue="pacaInvoices">
        <Tabs.List>
          <Tabs.Tab
            value="pacaInvoices"
            leftSection={<IconPackage style={iconStyle} color="#F18835" />}
          >
            Pacas Facturadas
          </Tabs.Tab>
          <Tabs.Tab
            value="clotheInvoices"
            leftSection={<IconShirtSport style={iconStyle} color="#F18835" />}
          >
            Ropas Facturadas
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="pacaInvoices">
          <PacaInvoiceTable />
        </Tabs.Panel>
        <Tabs.Panel value="clotheInvoices">
          <ClotheInvoiceTable />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default Cashier;
