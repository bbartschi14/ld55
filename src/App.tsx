import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./styles/theme";
import Canvas from "@/components/Canvas/Canvas";

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <Canvas />
    </MantineProvider>
  );
}
