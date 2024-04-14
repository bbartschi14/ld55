import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./styles/theme";
import Canvas from "@/components/Canvas/Canvas";
import { Hud } from "@/components/Hud/Hud";
import LevelManager from "@/components/LevelManager/LevelManager";

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <Hud />
      <LevelManager>
        <Canvas />
      </LevelManager>
    </MantineProvider>
  );
}
