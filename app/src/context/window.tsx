import { createContext, ReactNode } from "react";
import { Window } from "@/@types/window";

export const windowContext = createContext<Window[]>([]);

type contextProps = {
  children: ReactNode;
  value?: Window[];
};

/**
 * @param props
 * @constructor
 */
const WindowContext = (props: contextProps): JSX.Element => {
  return (
    <windowContext.Provider value={props.value || []}>
      {props.children}
    </windowContext.Provider>
  );
};
export { WindowContext };
