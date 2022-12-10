import { ReactNode } from "react";
import { Window } from "@/@types/window";
import { generateUuid } from "@/libs/uuid";

const createWindow = (title: string, child: ReactNode): Window => {
  return {
    id: generateUuid(),
    isClosable: false,
    isMinimized: false,
    isMaximized: false,
    pos: { x: 0, y: 0 },
    size: { width: 300, height: 300 },
    title,
    child,
  };
};
export { createWindow };
