import React, { useEffect } from "react";
import {  MantineProvider } from "@mantine/core";
import "./App.css";
import Header from "./components/Header";
import useGlobalStore from "./store/globalStore";

const App: React.FC = (): JSX.Element => {
  const { reset } = useGlobalStore();

  useEffect(() => {
    const navigation = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;
    if (navigation.type === "reload") {
      reset();
    }
  }, []);
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: "light",
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
