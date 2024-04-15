import { ActionIcon, Affix } from "@mantine/core";
import { Howler } from "howler";
import { useEffect } from "react";
import { SpeakerHigh, SpeakerSlash } from "@phosphor-icons/react";
import { useDocumentVisibility, useToggle } from "@mantine/hooks";

const AudioManager = () => {
  const [isMuted, toggle] = useToggle();
  const documentState = useDocumentVisibility();

  useEffect(() => {
    Howler.volume(isMuted || documentState === "hidden" ? 0 : 1);
  }, [isMuted, documentState]);

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
