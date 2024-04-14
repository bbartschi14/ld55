import { useGameStore } from "@/stores/gameStore";
import { Center, Text } from "@mantine/core";
import { useEffect, useRef } from "react";
import { animated, to, useSpring } from "@react-spring/web";

const Countdown = () => {
  const text = useRef<HTMLDivElement>(null);
  const runId = useGameStore((state) => state.runId);
  const characterState = useGameStore((state) => state.characterState);

  const [styles, api] = useSpring(() => ({
    transform: 1,
    scale: 1,
    opacity: 0,
  }));

  useEffect(() => {
    const textCurrent = text.current;
    const updateText = (value: number) => {
      if (textCurrent) {
        textCurrent.textContent = value.toString();
        api.start({
          from: {
            transform: 1,
            scale: 1,
            opacity: 0,
          },
          to: {
            transform: 0,
            scale: 1,
            opacity: 1,
          },
        });
      }
    };

    if (characterState === "wait") {
      let count = 4;
      const interval = setInterval(() => {
        count -= 1;
        updateText(count);
        if (count === 0) {
          clearInterval(interval);
        }
      }, 1000);
      return () => {
        if (textCurrent && count === 1) {
          textCurrent.textContent = "GO";

          api.start({
            from: {
              transform: 0,
              opacity: 0,
              scale: 2,
            },
            to: [
              {
                transform: 0,
                opacity: 1,
                scale: 1,
              },
              {
                transform: 0,
                opacity: 0,
                scale: 1,
              },
            ],
          });
        }
        clearInterval(interval);
      };
    }
  }, [runId, characterState, api]);

  return (
    <Center w="100dvw" h="100dvh">
      <div style={{ transform: "translateY(-10dvh)" }}>
        <animated.div
          style={{
            opacity: styles.opacity,
            transform: to(
              [styles.transform, styles.scale],
              (t, s) => `translateY(-${t * 100}%) scale(${s})`
            ),
          }}
        >
          <Text
            ref={text}
            ta="center"
            fz="5rem"
            c="white"
            fw={900}
            style={{ textShadow: "0px 0px 32px #ffffff91" }}
          >
            3
          </Text>
        </animated.div>
      </div>
    </Center>
  );
};

export default Countdown;
