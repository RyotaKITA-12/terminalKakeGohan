import { ReactNode } from "react";
import { Window } from "@/@types/window";
import { generateUuid } from "@/libs/uuid";

const createWindow = (
  title: string,
  child: ReactNode,
  data?: { closable?: boolean; uuid?: string; width?: number; height?: number }
): Window => {
  return {
    id: data?.uuid || generateUuid(),
    isClosable: data?.closable || false,
    isMinimized: false,
    isMaximized: false,
    pos: { x: 0, y: 0 },
    size: { width: data?.width || 300, height: data?.height || 300 },
    title,
    child,
  };
};
export { createWindow };
