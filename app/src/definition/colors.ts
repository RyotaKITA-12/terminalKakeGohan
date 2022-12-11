const selectableColors = [
  "#0C0C0C",
  "#0037DA",
  "#13A10E",
  "#3A96DD",
  "#C50F1F",
  "#881798",
  "#C19C00",
  "#CCCCCC",
  "#767676",
  "#3B78FF",
  "#16C60C",
  "#61D6D6",
  "#E74856",
  "#B4009E",
  "#F9F1A5",
  "#F2F2F2",
];
const defaultColors: TColors = {
  screenText: {
    color: "#CCCCCC",
    name: "画面の文字",
  },
  screenBg: {
    color: "#0C0C0C",
    name: "画面の背景",
  },
  boldText: {
    color: "#CCCCCC",
    name: "太文字",
  },
  selectedText: {
    color: "#881798",
    name: "選択文字",
  },
};
export { selectableColors, defaultColors };
