import { vars } from "@/styles/theme";
import { rem } from "@mantine/core";
import { style } from "@vanilla-extract/css";

const KEY_SIZE = 50;

export const key = style({
  width: rem(KEY_SIZE),
  height: rem(KEY_SIZE),
  borderRadius: vars.radius.md,
  border: `1px solid white`,

  transition: "transform 0.1s, background 0.1s",

  selectors: {
    "&[data-pressed=true]": {
      background: "rgba(255,255,255,0.25)",
      transform: "scale(1.1)",
    },
  },
});

// Grid container for WASD layout
export const keyContainer = style({
  display: "grid",
  gridTemplateColumns: `repeat(3, ${rem(KEY_SIZE)})`,
  gap: rem(10),
  padding: rem(10),
  zIndex: 1000,
});
