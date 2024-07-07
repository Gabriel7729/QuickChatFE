import { IconMessage } from "@tabler/icons-react";

export interface RouteConfig {
  label: string;
  icon: typeof IconMessage;
  link: string;
  element: React.ComponentType;
}
