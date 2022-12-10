import { useEffect, useState } from "react";
import { WindowContext } from "@/context/window";
import { RetroWindow } from "@/components/window";
import Styles from "./App.module.scss";
import type { ManagedWindow } from "@/@types/window";
import { createWindow } from "@/libs/createWindow";
import { Prompt } from "@/components/prompt/Prompt";
import { PromptContext } from "@/context/prompt";
import { TPromptList } from "@/@types/prompt";
import { Color } from "@/components/color/Color";
import { ColorContext } from "@/context/color";
import { defaultColors } from "@/definition/colors";
import { Logo } from "@/components/logo/Logo";

const App = () => {
  const [data, setWindow] = useState<ManagedWindow>({});
  const [promptList, setPromptList] = useState<TPromptList>([]);
  const [colors, setColors] = useState<TColors>(defaultColors);
  useEffect(() => {
    const ColorPicker = createWindow("COLORS", <Color />, {
      width: 260,
      height: 200,
      minWidth: 260,
      minHeight: 200,
      minimized: true,
    });
    const Prompts = createWindow("PROMPTS", <Prompt />, {
      width: 400,
      height: 400,
      minWidth: 350,
      minimized: true,
    });
    const Inspector = createWindow("INSPECTOR", <></>);
    const window: ManagedWindow = {};
    window[ColorPicker.id] = ColorPicker;
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
        <ColorContext value={{ colors, setColors }}>
          <Logo />
          <div className={Styles.app}>{windows}</div>
          <div className={Styles.taskbar}>{minimizedWindows}</div>
        </ColorContext>
      </PromptContext>
    </WindowContext>
  );
};

export default App;
