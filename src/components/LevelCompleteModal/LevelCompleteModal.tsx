import { formatTime } from "@/components/Timer/Timer";
import { actions, useGameStore } from "@/stores/gameStore";
import { Button, Modal, Stack, Text } from "@mantine/core";

const scaleY = {
  in: { opacity: 1, transform: "translateY(0vh)" },
  out: { opacity: 0, transform: "translateY(100vh)" },
  transitionProperty: "transform, opacity",
};

const LevelCompleteModal = () => {
  const characterState = useGameStore((state) => state.characterState);
  const levelTime = useGameStore((state) => state.levelTime);

  return (
    <Modal
      opened={characterState === "finished"}
      onClose={() => {}}
      centered
      withCloseButton={false}
      transitionProps={{ transition: scaleY, duration: 1000 }}
      size="lg"
    >
      <Stack>
        <Text fz="3rem" fw="bold" ta="center">
          Level complete!
        </Text>
        <Text fz="3rem" ta="center">
          {formatTime(levelTime)}
        </Text>
        <Button onClick={() => actions.resetLevel()}>Reset</Button>
      </Stack>
    </Modal>
  );
};

export default LevelCompleteModal;
