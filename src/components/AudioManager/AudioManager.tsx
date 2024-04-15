import { ActionIcon, Affix } from "@mantine/core";
import { Howler } from "howler";
import { useEffect } from "react";
import { SpeakerHigh, SpeakerSlash } from "@phosphor-icons/react";
import { useDocumentVisibility, useLocalStorage } from "@mantine/hooks";

const AudioManager = () => {
  const [isMuted, setMuted] = useLocalStorage({
    key: "mute",
    defaultValue: false,
  });
  const documentState = useDocumentVisibility();

  useEffect(() => {
    Howler.volume(isMuted || documentState === "hidden" ? 0 : 1);
  }, [isMuted, documentState]);

  const Icon = isMuted ? SpeakerSlash : SpeakerHigh;

  return (
    <Affix bottom={24} left={24} style={{ zIndex: 999 }}>
      <ActionIcon
        variant="subtle"
        color="white"
        size="4rem"
        radius={999}
        onClick={() => setMuted((prev) => !prev)}
      >
        <Icon weight="fill" size="75%" />
      </ActionIcon>
    </Affix>
  );
};

export default AudioManager;
