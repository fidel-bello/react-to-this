import { MantineProvider } from "@mantine/core";
import "./App.css";
import Header from "./components/Header";

function App() {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: "dark",
      }}
    >
      <Header />
    </MantineProvider>
  );
}

export default App;
