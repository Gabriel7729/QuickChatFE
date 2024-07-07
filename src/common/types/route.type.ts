// src/types.ts
export interface RouteLink {
  label: string;
  link: string;
  element: React.ComponentType;
  notShowInMenu?: boolean;
  public?: boolean;
}

export interface RouteConfig {
  label: string;
  icon: React.FC<any>;
  initiallyOpened: boolean;
  accessRoles: string[];
  links: RouteLink[];
}
