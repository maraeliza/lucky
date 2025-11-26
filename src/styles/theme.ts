import { extendTheme, ThemeConfig } from "@chakra-ui/react";

export const theme: ThemeConfig = extendTheme({
  styles: {
    global: {
      body: {
        minHeigth: "100vh",
        heigth: "100%",
        fontFamily: "Inter",
      },
    },
  },
  breakpoints: {
    xs: "340px",
    sm: "480px",
    md: "768px",
    lg: "992px",
    xl: "1280px",
    "2xl": "1536px",
  },
  colors: {
    primary: {
      "900": "#ff4242",
      "700": "#ff4242",
      "500": "#ff667c",
      "400": "#fbbaa4",
      "200": "#f9e5c0",
    },
    dark: {
      "700": "#2c171c",
      "500": "#4B4949",
      "300": "#726F6F",
    },
    light: {
      "900": "#F5F5F5",
      "800": "#C2C2C2",
      "700": "#f9e5c0",
    },
    secondary: {
      "700": "#b6d0a0",
      "500": "#a6f6af",
    },
    error: "#ff4242",
    jumbo: "#7F808A",
  },
  fonts: {
    heading: "Inter",
    body: "Inter",
  },
});
