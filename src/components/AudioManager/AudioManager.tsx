import { ActionIcon, Affix } from "@mantine/core";
import { Howler } from "howler";
import { useEffect } from "react";
import { SpeakerHigh, SpeakerSlash } from "@phosphor-icons/react";
import { useToggle } from "@mantine/hooks";

const AudioManager = () => {
  const [isMuted, toggle] = useToggle();

  useEffect(() => {
    Howler.volume(isMuted ? 0 : 1);
  }, [isMuted]);

  const Icon = isMuted ? SpeakerSlash : SpeakerHigh;

  return (
    <Affix bottom={24} left={24}>
      <ActionIcon
        variant="subtle"
        color="white"
        size="4rem"
        radius={999}
        onClick={() => toggle()}
      >
        <Icon weight="fill" size="75%" />
      </ActionIcon>
    </Affix>
  );
};

export default AudioManager;
