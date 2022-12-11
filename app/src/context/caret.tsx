import { createContext, ReactNode } from "react";

type context = {
  caret?: TCaret;
  setCaret?: (data: TCaret) => void;
};

export const caretContext = createContext<context>({});

type contextProps = {
  children: ReactNode;
  value?: context;
};

/**
 * @param props
 * @constructor
 */
const CaretContext = (props: contextProps): JSX.Element => {
  return (
    <caretContext.Provider value={props.value || {}}>
      {props.children}
    </caretContext.Provider>
  );
};
export { CaretContext };
