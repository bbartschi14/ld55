import { Howl } from "howler";

export const SOUNDS = {
  hit1: new Howl({ src: ["/audio/hit1.mp3"], volume: 0.5 }),
  hit2: new Howl({ src: ["/audio/hit2.mp3"], volume: 0.5 }),
  fullsong: new Howl({
    src: ["/audio/fullsong.mp3"],
    loop: true,
    html5: true,
    volume: 0.75,
  }),
  ringin: new Howl({ src: ["/audio/ringin.mp3"] }),
};
