import type { ReactNode } from "react";

type Window = {
  id: string;
  isClosable: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  title: string;
  pos: Position;
  size: Size;
  minSize: Size;
  child: ReactNode;
};
type ManagedWindow = {
  [key: string]: Window;
};
