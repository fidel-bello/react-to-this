import React, { createContext, useCallback, useContext, useMemo, useReducer } from "react";

interface GiphyState {
  lastStep: boolean;
  CANVAS_WIDTH: number;
  CANVAS_HEIGHT: number;
  active: number;
  file: File | null;
  imageUrl: string | null;
  selectValue: string;
  url: string;
}

type GiphyAction =
  | { type: "next" }
  | { type: "prev" }
  | { type: "setActive"; value: number }
  | { type: "setFile"; file: File }
  | { type: "setImageUrl"; imageUrl: string | null }
  | { type: "setValue"; value: string }
  | { type: "reset" };

interface GiphyContextValue extends GiphyState {
  next: () => void;
  prev: () => void;
  setActive: (value: number) => void;
  setFile: (file: File) => void;
  setImageUrl: (imageUrl: string | null) => void;
  setValue: (value: string) => void;
  reset: () => void;
}

const initialState: GiphyState = {
  lastStep: false,
  CANVAS_WIDTH: 112,
  CANVAS_HEIGHT: 112,
  active: 0,
  selectValue: "",
  file: null,
  imageUrl: null,
  url: "https://github.com/fidel-bello",
};

function reducer(state: GiphyState, action: GiphyAction): GiphyState {
  switch (action.type) {
    case "next":
      return {
        ...state,
        active: state.active < 3 ? state.active + 1 : state.active,
      };
    case "prev":
      return {
        ...state,
        active: state.active > 0 ? state.active - 1 : state.active,
      };
    case "setActive":
      return {
        ...state,
        active: action.value,
      };
    case "setFile":
      return {
        ...state,
        file: action.file,
      };
    case "setImageUrl":
      return {
        ...state,
        imageUrl: action.imageUrl,
      };
    case "setValue":
      return {
        ...state,
        selectValue: action.value,
      };
    case "reset":
      return initialState;
    default:
      return state;
  }
}

const GiphyContext = createContext<GiphyContextValue | null>(null);

export const GiphyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const next = useCallback(() => dispatch({ type: "next" }), []);
  const prev = useCallback(() => dispatch({ type: "prev" }), []);
  const setActive = useCallback((value: number) => dispatch({ type: "setActive", value }), []);
  const setFile = useCallback((file: File) => dispatch({ type: "setFile", file }), []);
  const setImageUrl = useCallback((imageUrl: string | null) => dispatch({ type: "setImageUrl", imageUrl }), []);
  const setValue = useCallback((value: string) => dispatch({ type: "setValue", value }), []);
  const reset = useCallback(() => dispatch({ type: "reset" }), []);

  const value: GiphyContextValue = useMemo(
    () => ({
      ...state,
      next,
      prev,
      setActive,
      setFile,
      setImageUrl,
      setValue,
      reset,
    }),
    [state, next, prev, setActive, setFile, setImageUrl, setValue, reset]
  );

  return <GiphyContext.Provider value={value}>{children}</GiphyContext.Provider>;
};

export const useGiphyContext = (): GiphyContextValue => {
  const context = useContext(GiphyContext);

  if (!context) {
    throw new Error("useGiphyContext must be used within a GiphyProvider");
  }

  return context;
};
