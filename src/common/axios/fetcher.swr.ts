import { useAuthStore } from "../store/session.store";

const baseURL = "http://localhost:57678/api";

export const fetcher = async (action: string) => {
  const token = useAuthStore.getState().claims?.token;
  const res = await fetch(baseURL + action, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      useAuthStore.getState().logout();
    }
  }

  return res.json();
};
