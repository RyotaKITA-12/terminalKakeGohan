import { createContext, ReactNode } from "react";
import type { ManagedWindow } from "@/@types/window";

type context = {
  data?: ManagedWindow;
  setWindowContext?: (data: ManagedWindow) => void;
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
