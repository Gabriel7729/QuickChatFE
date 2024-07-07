import { AppShell } from "@mantine/core";
import { Route, Routes } from "react-router-dom";
import { MainRoutes } from "./main-router";
import { Navbar } from "../../components/navbar";

export const DashboardRoutes = (): JSX.Element => {
  return (
    <AppShell navbar={{ width: "100px", breakpoint: "sm" }}>
      <AppShell.Navbar>
        <Navbar />
      </AppShell.Navbar>
      <AppShell.Main>
        <Routes>
          {MainRoutes.map((route, index) => (
            <Route
              key={"route" + index}
              path={route.link}
              element={<route.element />}
            />
          ))}
        </Routes>
      </AppShell.Main>
    </AppShell>
  );
};

export default DashboardRoutes;
