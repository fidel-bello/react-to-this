import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface GlobalStore {
  active: number;
  file: File | null;
  imageUrl: string | null;
  selectValue: string | null;
  next: () => void;
  prev: () => void;
  setActive: (value: number) => void;
  setFile: (file: File) => void;
  setImageUrl: (imageUrl: string | null) => void;
  setValue: (value: string | null ) => void;
  reset: () => void;
}

const initialState = {
  active: 0,
  selectValue: null,
  file: null,
  imageUrl: null,
};

const useGlobalStore = create<GlobalStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        next: () =>
          set((state) => ({
            active: state.active < 4 ? state.active + 1 : state.active,
          })),
        prev: () =>
          set((state) => ({
            active: state.active > 0 ? state.active - 1 : state.active,
          })),
        setFile: (file: File) => set(() => ({ file: file })),
        setImageUrl: (imageUrl: string | null) =>
          set(() => ({ imageUrl: imageUrl })),
        setActive: (value: number) => set(() => ({ active: value })),
        setValue: (value: string | null) => set(() => ({ selectValue: value })),
        reset: () => set(initialState)
      }),

      {
        name: "global-store",
      }
    )
  )
);

export default useGlobalStore;
