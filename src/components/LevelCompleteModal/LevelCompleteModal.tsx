import { formatTime } from "@/components/Timer/Timer";
import { actions, useGameStore } from "@/stores/gameStore";
import { Button, Modal, Stack, Text } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";

const scaleY = {
  in: { opacity: 1, transform: "translateY(0vh)" },
  out: { opacity: 0, transform: "translateY(100vh)" },
  transitionProperty: "transform, opacity",
};

const LevelCompleteModal = () => {
  const characterState = useGameStore((state) => state.characterState);
  const levelTime = useGameStore((state) => state.levelTime);
  const currentLevel = useGameStore((state) => state.currentLevel);

  const [debouncedLevel] = useDebouncedValue(currentLevel, 1000);

  return (
    <Modal
      opened={characterState === "finished"}
      onClose={() => {}}
      centered
      withCloseButton={false}
      transitionProps={{ transition: scaleY, duration: 1000 }}
    >
      <Stack pt="md">
        <Text fz="3rem" fw="bold" ta="center">
          {`Level ${
            debouncedLevel !== null ? debouncedLevel + 1 : 0
          } complete!`}
        </Text>
        <Text fz="3rem" ta="center">
          {formatTime(levelTime)}
        </Text>
        <Stack pb="md" align="center">
          <Button onClick={() => actions.nextLevel()} size="xl">
            Next Level
          </Button>
          <Button onClick={() => actions.resetLevel()} variant="light">
            Restart Level
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
};

export default LevelCompleteModal;
