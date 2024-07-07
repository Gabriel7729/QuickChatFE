import { Routes, Route } from "react-router-dom";
import Unauthorized from "../pages/login";
import PrivateRoutes from "./private-routes/private-routes";
import PublicRoutes from "./public-routes/public-routes";
import DashboardRoutes from "./dashboard-routes/dashboard-routes";

export const AppRouter = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoutes>
            <Unauthorized />
          </PublicRoutes>
        }
      />

      <Route
        path="/*"
        element={
          <PrivateRoutes>
            <DashboardRoutes />
          </PrivateRoutes>
        }
      />
    </Routes>
  );
};
