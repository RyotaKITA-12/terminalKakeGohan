import { defaultColors } from "@/definition/colors";
import { TProfile } from "@/@types/profile";

const defaultProfile: TProfile = {
  id: "",
  name: "default",
  prompt: [
    { name: "ユーザ名", value: "%n", preview: "ryota-k" },
    { name: "マシン名( . まで)", value: "%m", preview: "MacBook-Pro" },
    { name: "カレントディレクトリ", value: "%c", preview: "dev" },
    { name: "root : #,  それ以外 : %", value: "%#", preview: "%" },
  ],
  color: defaultColors,
  caret: "block",
};
export { defaultProfile };
