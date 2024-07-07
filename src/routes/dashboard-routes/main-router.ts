import {
  IconMessage,
  IconSettings,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react";
import { RouteConfig } from "../../common/types/route.type";
import ChatsPage from "../../pages/chats";
import ContactsPage from "../../pages/contacs";
import SettingsPage from "../../pages/settings";
import GroupsPage from "../../pages/groups";

export const MainRoutes: RouteConfig[] = [
  {
    label: "Chats",
    icon: IconMessage,
    element: ChatsPage,
    link: "/chats",
  },
  {
    label: "Groups",
    icon: IconUsersGroup,
    element: GroupsPage,
    link: "/groups",
  },
  {
    label: "Contacts",
    icon: IconUsers,
    element: ContactsPage,
    link: "/contacts",
  },
  {
    label: "Settings",
    icon: IconSettings,
    element: SettingsPage,
    link: "/settings",
  },
];
