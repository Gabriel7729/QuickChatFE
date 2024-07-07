import { create } from "zustand";
import { createJSONStorage, persist, PersistOptions } from "zustand/middleware";
import { LoginResponse } from "../../models/auth/auth.model";
import { BranchResponseDto } from "../../models/branch/branch.model";

export type AuthUser = {
  claims: LoginResponse | null;
  branchSelected: BranchResponseDto | null;
};

export type AuthUserActions = {
  setClaims: (claims: LoginResponse) => void;
  setBranchSelected: (branchSelected: BranchResponseDto) => void;
  logout: () => void;
};

type State = AuthUser & AuthUserActions;

type PersistState = (
  config: (set: any, get: any) => State,
  options: PersistOptions<State>
) => (set: any, get: any, api: any) => State;

export const useAuthStore = create<State>(
  (persist as PersistState)(
    (set) => ({
      claims: null,
      setClaims: (claims: LoginResponse) => set({ claims }),
      branchSelected: null,
      setBranchSelected: (branchSelected: BranchResponseDto) => set({ branchSelected }),
      logout: () => set({ claims: null }),
    }),
    {
      name: 'auth-storage', // unique name for the storage item
      storage: createJSONStorage(() => localStorage), // use `storage` instead of `getStorage`
    }
  )
);
