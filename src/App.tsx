import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./styles/theme";
import Canvas from "@/components/Canvas/Canvas";
import { Hud } from "@/components/Hud/Hud";
import LevelManager from "@/components/LevelManager/LevelManager";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/components/Home/Home";

export default function App() {
  return (
    <Router>
      <MantineProvider theme={theme}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/game"
            element={
              <>
                <Hud />
                <LevelManager>
                  <Canvas />
                </LevelManager>
              </>
            }
          />
        </Routes>
      </MantineProvider>
    </Router>
  );
}
