import { useLocation } from "react-router-dom";

export const matchPath = (routePath: string, currentPath: string): boolean => {
  const routePathParts = routePath.split("/");
  const currentPathParts = currentPath.split("/");

  if (routePathParts.length !== currentPathParts.length) {
    return false;
  }

  for (let i = 0; i < routePathParts.length; i++) {
    if (routePathParts[i].startsWith(":")) {
      continue; // Skip dynamic segments
    }
    if (routePathParts[i] !== currentPathParts[i]) {
      return false;
    }
  }

  return true;
};

export const findCurrentRoute = (routes: any[], pathname: string) => {
  for (let route of routes) {
    const routePathParts = route.link.split("/");
    const pathnameParts = pathname.split("/");

    if (routePathParts.length !== pathnameParts.length) {
      continue;
    }

    let match = true;
    for (let i = 0; i < routePathParts.length; i++) {
      if (routePathParts[i].startsWith(":")) {
        continue;
      }
      if (routePathParts[i] !== pathnameParts[i]) {
        match = false;
        break;
      }
    }

    if (match) {
      return route;
    }
  }
  return null;
};

export function useQuery() {
  return new URLSearchParams(useLocation().search);
}
