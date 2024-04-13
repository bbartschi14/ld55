import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./styles/theme";
import { Welcome } from "@/components/Welcome/Welcome";
import { ColorSchemeToggle } from "@/components/ColorSchemeToggle/ColorSchemeToggle";

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <Welcome />
      <ColorSchemeToggle />
    </MantineProvider>
  );
}
