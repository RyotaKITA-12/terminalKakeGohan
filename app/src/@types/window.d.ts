import type { ReactNode } from "react";
import type { Position } from "@/@types/position";
import type { Size } from "@/@types/size";

type Window = {
  id: string;
  isClosable: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  title: string;
  pos: Position;
  size: Size;
  child: ReactNode;
};
