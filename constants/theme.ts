import { Platform } from "react-native";

// Green Accents
const greenActive = "#14532d"; // Forest Green for Light Mode
const greenBright = "#14532d"; // Vibrant Mint for Dark Mode

export const Colors = {
  light: {
    text: "#11181C", // Standard Dark Charcoal
    background: "#FFFFFF", // Pure White
    tint: greenActive, // Green only for active tabs/buttons
    icon: "#687076",
    tabIconDefault: "#94A3B8",
    tabIconSelected: greenActive,
  },
  dark: {
    text: "#ECEDEE", // Off-white text
    background: "#0D0D0D", // Deep "Almost Black"
    tint: greenBright, // Bright green for active tabs/buttons
    icon: "#9BA1A6",
    tabIconDefault: "#475569",
    tabIconSelected: greenBright,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
