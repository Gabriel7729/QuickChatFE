import { Loader, Tabs, rem } from "@mantine/core";
import { IconLogs, IconUser } from "@tabler/icons-react";
import { useParams } from "react-router-dom";
import { useBranchById } from "../../../hooks/branch/branch.hooks";
import { BranchDetailHeader } from "./DetailHeader";
import { DetailLogs } from "./DetailLogs";
import { BranchDetailTable } from "./DetailTable";

export const BranchDetail = () => {
  const iconStyle = { width: rem(12), height: rem(12) };
  const { id } = useParams();

  const { data, isLoading } = useBranchById(id ?? "");
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <BranchDetailHeader branch={data?.value!} />
          <Tabs defaultValue="users" mt={30}>
            <Tabs.List>
              <Tabs.Tab
                value="users"
                leftSection={<IconUser style={iconStyle} />}
              >
                Users
              </Tabs.Tab>
              <Tabs.Tab
                value="logs"
                leftSection={<IconLogs style={iconStyle} />}
              >
                Logs
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="users">
              <BranchDetailTable branch={data?.value!} />
            </Tabs.Panel>
            <Tabs.Panel value="logs">
              <DetailLogs />
            </Tabs.Panel>
          </Tabs>
        </>
      )}
    </>
  );
};

export default BranchDetail;
