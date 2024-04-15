import { style } from "@vanilla-extract/css";

export const root = style({
  position: "fixed",
  inset: 0,
  zIndex: 100,
  pointerEvents: "none",
});

export const score = style({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  padding: "2rem",
  display: "flex",
  justifyContent: "space-between",
});
