import { useEffect, useState } from "react";
import { WindowContext } from "@/context/window";
import { generateUuid } from "@/libs/uuid";
import { RetroWindow } from "@/components/window";
import Styles from "./App.module.scss";
import type { ReactNode } from "react";
import type { Window, ManagedWindow } from "@/@types/window";

const App = () => {
  const [data, setWindow] = useState<ManagedWindow>({});
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

  useEffect(() => {
    const ColorPicker = createWindow("COLORS", <></>);
    const Output = createWindow("OUTPUT", <></>);
    const Appearance = createWindow("APPEARANCES", <></>);
    const Inspector = createWindow("INSPECTOR", <></>);
    const window: ManagedWindow = {};
    window[ColorPicker.id] = ColorPicker;
    window[Output.id] = Output;
    window[Appearance.id] = Appearance;
    window[Inspector.id] = Inspector;
    setWindow(window);
  }, [0]);

  return (
    <WindowContext value={{ data: data, setWindowContext: setWindow }}>
      <div className={Styles.app}>
        {Object.keys(data).map((key) => {
          const value = data[key];
          return <RetroWindow window={value} />;
        })}
      </div>
    </WindowContext>
  );
};

export default App;
