type TColorsTarget = "screenText" | "screenBg" | "boldText" | "selectedText";

type TColors = {
  [key in TColorsTarget]: {
    color: string;
    name: string;
  };
};
