import { defaultColors } from "@/definition/colors";

const defaultProfile = {
  name: "default",
  prompt: [
    { name: "ユーザ名", value: "%n", preview: "ryota-k" },
    { name: "マシン名( . まで)", value: "%m", preview: "MacBook-Pro" },
    { name: "カレントディレクトリ", value: "%c", preview: "dev" },
    { name: "root : #,  それ以外 : %", value: "%#", preview: "%" },
  ],
  color: defaultColors,
};
export { defaultProfile };
