import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./styles/theme";
import Canvas from "@/components/Canvas/Canvas";
import { Hud } from "@/components/Hud/Hud";
import LevelManager from "@/components/LevelManager/LevelManager";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/components/Home/Home";
import { useEffect } from "react";
import AudioManager from "@/components/AudioManager/AudioManager";
import { SOUNDS } from "@/components/AudioManager/sounds";

export default function App() {
  useEffect(() => {
    const clickHandler = () => {
      SOUNDS.fullsong.play();
      document.removeEventListener("click", clickHandler);
    };

    document.addEventListener("click", clickHandler);

    return () => {
      SOUNDS.fullsong.stop();
      document.removeEventListener("click", clickHandler);
    };
  }, []);

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
        <AudioManager />
      </MantineProvider>
    </Router>
  );
}
