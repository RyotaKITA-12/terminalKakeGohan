import { createContext, ReactNode } from "react";

type context = {
  colors?: TColors;
  setColors?: (data: TColors) => void;
};

export const colorContext = createContext<context>({});

type contextProps = {
  children: ReactNode;
  value?: context;
};

/**
 * @param props
 * @constructor
 */
const ColorContext = (props: contextProps): JSX.Element => {
  return (
    <colorContext.Provider value={props.value || {}}>
      {props.children}
    </colorContext.Provider>
  );
};
export { ColorContext };
