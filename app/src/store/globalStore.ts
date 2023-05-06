import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface GlobalStore {
  active: number;
  next: () => void;
  prev: () => void;
  setActive: (value: number) => void;
}

const initialState = {
  active: 0,
};

const useGlobalStore = create<GlobalStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        next: () =>
          set((state) => ({
            active: state.active < 3 ? state.active + 1 : state.active,
          })),
        prev: () =>
          set((state) => ({
            active: state.active > 0 ? state.active - 1 : state.active,
          })),
        setActive: (value) => set({ active: value }),
      }),
      {
        name: "global-store",
      }
    )
  )
);

export default useGlobalStore;
