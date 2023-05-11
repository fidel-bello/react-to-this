import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
interface GlobalStore {
  CANVAS_WIDTH: number;
  CANVAS_HEIGHT: number;
  active: number;
  file: File | null;
  imageUrl: string | null;
  selectValue: string;
  next: () => void;
  prev: () => void;
  setActive: (value: number) => void;
  setFile: (file: File) => void;
  setImageUrl: (imageUrl: string | null) => void;
  setValue: (value: string) => void;
  reset: () => void;
}

const initialState = {
  CANVAS_WIDTH: 112,
  CANVAS_HEIGHT: 112,
  active: 0,
  selectValue: "",
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
            active: state.active < 3 ? state.active  + 1 : state.active,
          })),
        prev: () =>
          set((state) => ({
            active: state.active > 0 ? state.active - 1 : state.active,
          })),
        setFile: (file: File) => set(() => ({ file: file })),
        setImageUrl: (imageUrl: string | null) =>
          set(() => ({ imageUrl: imageUrl })),
        setActive: (value: number) => set(() => ({ active: value })),
        setValue: (value: string) => set(() => ({ selectValue: value })),
        reset: () => set(initialState),
      }),

      {
        name: "global-store",
      }
    )
  )
);

export default useGlobalStore;
