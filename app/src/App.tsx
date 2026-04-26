import React, { useEffect } from "react";
import {  MantineProvider } from "@mantine/core";
import "./App.css";
import Header from "./components/Header";
import { useGiphyContext } from "./context/GiphyContext";

const App: React.FC = (): JSX.Element => {
  const { reset } = useGiphyContext();

  useEffect(() => {
    const navigation = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;
    if (navigation.type === "reload") {
      reset();
    }
  }, [reset]);
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: "dark",
        other: {
          fontFamily: {
            sans:
              '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
          },
        }
      }}
    >
      <Header />
    </MantineProvider>
  );
};

export default App;
