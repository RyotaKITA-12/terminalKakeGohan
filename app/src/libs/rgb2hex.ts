const rgb2hex = (rgb: number[]) => {
  if (rgb.length !== 3) return "#000000";
  return `#${`0${rgb[0].toString(16)}`.slice(-2)}${`0${rgb[1].toString(
    16
  )}`.slice(-2)}${`0${rgb[2].toString(16)}`.slice(-2)}`;
};
export { rgb2hex };
