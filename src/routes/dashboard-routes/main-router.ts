import {
  IconBuilding,
  IconBuildingStore,
  IconCheckupList,
  IconHome,
  IconInvoice,
  IconUsers,
  IconUsersPlus,
} from "@tabler/icons-react";
import Branches from "../../pages/branches";
import Users from "../../pages/users";
import { RouteConfig } from "../../common/types/route.type";
import Home from "../../pages/home";
import BranchConfiguration from "../../pages/branch/configuration";
import BranchManagment from "../../pages/branch/managment";
import Cashier from "../../pages/cashier";
import Inventory from "../../pages/inventory";
import UserDetails from "../../pages/users/details";
import UserAccount from "../../pages/users/account";
import BranchDetail from "../../pages/branches/Detail";
import InvoicePacaDetailsPage from "../../pages/cashier/details/indexPacaDetails";
import InvoiceItemDetailsPage from "../../pages/cashier/details/indexItemDetails";
import AddInvoicePage from "../../pages/cashier/add";
import ClientsPage from "../../pages/customer";
import CustomerDetailsPage from "../../pages/customer/details";

export const MainRouter: RouteConfig[] = [
  {
    label: "Dashboard",
    icon: IconHome,
    initiallyOpened: false,
    accessRoles: ["Owner"],
    links: [
      {
        label: "Panel de Control",
        link: "/",
        element: Home,
      },
    ],
  },
  {
    label: "Sucursal",
    icon: IconBuildingStore,
    initiallyOpened: false,
    accessRoles: ["Owner"],
    links: [
      {
        label: "Gestión de Sucursal",
        link: "/Sucursal/Gestion",
        element: BranchManagment,
      },
      {
        label: "Configuración",
        link: "/Sucursal/Configuracion",
        element: BranchConfiguration,
      },
    ],
  },
  {
    label: "Caja",
    icon: IconInvoice,
    initiallyOpened: false,
    accessRoles: ["Owner", "Cashier"],
    links: [
      {
        label: "Facturación",
        link: "/facturas",
        element: Cashier,
      },
      {
        label: "Agregar Factura",
        link: "/facturas/agregar/:type",
        element: AddInvoicePage,
        notShowInMenu: true,
      },
      {
        label: "Detalle de Facturas Pacas",
        link: "/facturas/paca/:id",
        element: InvoicePacaDetailsPage,
        notShowInMenu: true,
      },
      {
        label: "Detalle de Facturas Ropas",
        link: "/facturas/ropa/:id",
        element: InvoiceItemDetailsPage,
        notShowInMenu: true,
      },
    ],
  },
  {
    label: "Clientes",
    icon: IconUsers,
    initiallyOpened: false,
    accessRoles: ["Owner", "Cashier"],
    links: [
      {
        label: "Administración de Clientes",
        link: "/clientes",
        element: ClientsPage,
      },
      {
        label: "Detalles del Clientes",
        link: "/clientes/:id",
        element: CustomerDetailsPage,
        notShowInMenu: true,
      },
    ],
  },
  {
    label: "Inventario",
    icon: IconCheckupList,
    initiallyOpened: false,
    accessRoles: ["Owner"],
    links: [
      {
        label: "Catálogo de Pacas",
        link: "/Inventario/Pacas",
        element: Inventory,
      },
    ],
  },
  {
    label: "Sucursales",
    icon: IconBuilding,
    initiallyOpened: false,
    accessRoles: ["Admin"],
    links: [
      {
        label: "Gestión de Sucursales",
        link: "/",
        element: Branches,
      },
      {
        label: "Información de sucursal",
        link: "/sucursal/detalle/:id",
        element: BranchDetail,
        notShowInMenu: true
      },
    ],
  },
  {
    label: "Usuarios",
    icon: IconUsersPlus,
    initiallyOpened: false,
    accessRoles: ["Admin"],
    links: [
      {
        label: "Administración de Usuarios",
        link: "/usuarios",
        element: Users,
      },
      {
        label: "Detalle de Usuarios",
        link: "/usuarios/:id",
        element: UserDetails,
        notShowInMenu: true,
      },
    ],
  },
  {
    label: "Cuenta de Usuario",
    icon: IconUsers,
    initiallyOpened: false,
    accessRoles: [],
    links: [
      {
        label: "Configurar Cuenta",
        link: "/usuario/cuenta",
        element: UserAccount,
        notShowInMenu: true,
        public: true,
      },
    ],
  },
];

export const generateRoutes = (routes: RouteConfig[], role: string) => {
  return routes.flatMap((route) =>
    route.links
      .filter((link) => link.public || route.accessRoles.includes(role))
      .map((link) => ({
        title: route.label,
        path: link.link,
        element: link.element,
        accessRoles: route.accessRoles,
      }))
  );
};
