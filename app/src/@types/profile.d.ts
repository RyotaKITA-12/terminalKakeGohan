import { TPromptList } from "@/@types/prompt";

type TProfile = {
  id: string;
  name: string;
  prompt: TPromptList;
  color: TColors;
  caret: TCaret;
};
