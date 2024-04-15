import { gameStore } from "@/stores/gameStore";
import { Text } from "@mantine/core";
import { useEffect, useRef } from "react";

export const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${seconds}`;
};

const Timer = () => {
  const text = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    const unsub = gameStore.subscribe((state) => {
      if (!text.current) {
        return;
      }

      text.current.textContent = formatTime(state.levelTime);
    });

    return unsub;
  }, []);

  return (
    <Text
      ref={text}
      fz="3rem"
      c="white"
      pl="md"
      fw="500"
      lts={"2px"}
      style={{ textShadow: "2px 2px 4px #00000098" }}
    >
      0:00:000
    </Text>
  );
};

export default Timer;
