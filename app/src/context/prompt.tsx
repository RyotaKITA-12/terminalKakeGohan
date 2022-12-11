import { createContext, ReactNode } from "react";
import type { TPromptList } from "@/@types/prompt";

type context = {
  promptList?: TPromptList;
  setPromptList?: (data: TPromptList) => void;
};

export const promptContext = createContext<context>({});

type contextProps = {
  children: ReactNode;
  value?: context;
};

/**
 * @param props
 * @constructor
 */
const PromptContext = (props: contextProps): JSX.Element => {
  return (
    <promptContext.Provider value={props.value || {}}>
      {props.children}
    </promptContext.Provider>
  );
};
export { PromptContext };
