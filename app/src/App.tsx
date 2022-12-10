import { useEffect, useState } from "react";
import { WindowContext } from "@/context/window";
import { RetroWindow } from "@/components/window";
import Styles from "./App.module.scss";
import type { ManagedWindow } from "@/@types/window";
import { createWindow } from "@/libs/createWindow";
import { Prompt } from "@/components/prompt/Prompt";
import { PromptContext } from "@/context/prompt";
import { TPromptList } from "@/@types/prompt";
import {Color} from "@/components/color/Color";

const App = () => {
  const [data, setWindow] = useState<ManagedWindow>({});
  const [promptList, setPromptList] = useState<TPromptList>([]);
  useEffect(() => {
    const ColorPicker = createWindow("COLORS", <Color/>);
    const Output = createWindow("OUTPUT", <></>);
    const Prompts = createWindow("PROMPTS", <Prompt />, {
      width: 400,
      height: 400,
    });
    const Inspector = createWindow("INSPECTOR", <></>);
    const window: ManagedWindow = {};
    window[ColorPicker.id] = ColorPicker;
    window[Output.id] = Output;
    window[Prompts.id] = Prompts;
    window[Inspector.id] = Inspector;
    setWindow(window);
  }, [0]);
  const windows = [],
    minimizedWindows = [];
  for (const key of Object.keys(data).reverse()) {
    const window = data[key];
    if (window.isMinimized) {
      minimizedWindows.push(<RetroWindow window={window} key={window.id} />);
    } else {
      windows.push(<RetroWindow window={window} key={window.id} />);
    }
  }
  return (
    <WindowContext value={{ data: data, setWindowContext: setWindow }}>
      <PromptContext value={{ promptList, setPromptList }}>
        <div className={Styles.app}>{windows}</div>
        <div className={Styles.taskbar}>{minimizedWindows}</div>
      </PromptContext>
    </WindowContext>
  );
};

export default App;
