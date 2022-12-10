import { createContext, ReactNode } from "react";
import { Window } from "@/@types/window";

type context = {
  data?: Window[];
  setWindowContext?: (data: Window[]) => void;
};

export const windowContext = createContext<context>({});

type contextProps = {
  children: ReactNode;
  value?: context;
};

/**
 * @param props
 * @constructor
 */
const WindowContext = (props: contextProps): JSX.Element => {
  return (
    <windowContext.Provider value={props.value || {}}>
      {props.children}
    </windowContext.Provider>
  );
};
export { WindowContext };