import { createTheme } from "@mantine/core";
import { themeToVars } from "@mantine/vanilla-extract";

export const theme = createTheme({
  primaryColor: "grape",
  fontFamily: "'Oswald Variable', sans-serif",
});
export const vars = themeToVars(theme);
