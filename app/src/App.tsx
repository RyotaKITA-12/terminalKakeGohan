import { useEffect, useState } from "react";
import { WindowContext } from "@/context/window";
import { RetroWindow } from "@/components/window";
import Styles from "./App.module.scss";
import type { ManagedWindow } from "@/@types/window";
import { createWindow } from "@/libs/createWindow";

const App = () => {
  const [data, setWindow] = useState<ManagedWindow>({});

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
          return <RetroWindow window={value} key={value.id} />;
        })}
      </div>
    </WindowContext>
  );
};

export default App;
