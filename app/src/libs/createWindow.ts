import { ReactNode } from "react";
import { Window } from "@/@types/window";
import { generateUuid } from "@/libs/uuid";

const createWindow = (
  title: string,
  child: ReactNode,
  data?: {
    closable?: boolean;
    uuid?: string;
    width?: number;
    height?: number;
    minWidth?: number;
    minHeight?: number;
    posX?: number;
    posY?: number;
    minimized?: boolean;
  }
): Window => {
  return {
    id: data?.uuid || generateUuid(),
    isClosable: data?.closable || false,
    isMinimized: data?.minimized || false,
    isMaximized: false,
    pos: { x: data?.posX || 0, y: data?.posY || 0 },
    size: { width: data?.width || 300, height: data?.height || 300 },
    minSize: {
      width: data?.minWidth || data?.width || 300,
      height: data?.minHeight || data?.height || 300,
    },
    title,
    child,
  };
};
export { createWindow };
