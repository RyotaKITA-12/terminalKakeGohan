import { useEffect, useState } from "react";
import { WindowContext } from "@/context/window";
import { RetroWindow } from "@/components/window";
import { TerminalPreview } from "@/components/preview";
import Styles from "./App.module.scss";
import type { ManagedWindow } from "@/@types/window";
import { createWindow } from "@/libs/createWindow";
import { Prompt } from "@/components/prompt/Prompt";
import { PromptContext } from "@/context/prompt";
import { TPromptList } from "@/@types/prompt";
import { Caret } from "@/components/caret/Caret";
import { ColorContext } from "@/context/color";
import { defaultColors } from "@/definition/colors";
import { Logo } from "@/components/logo/Logo";
import { Inspector } from "@/components/inspector/Inspector";
import { CaretContext } from "@/context/caret";
import { Color } from "@/components/color/Color";

const App = () => {
  const [data, setWindow] = useState<ManagedWindow>({});
  const [promptList, setPromptList] = useState<TPromptList>([]);
  const [colors, setColors] = useState<TColors>(defaultColors);
  const [caret, setCaret] = useState<TCaret>("block");
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
    const inspector = createWindow("INSPECTOR", <Inspector />);
    const caret = createWindow("CARET", <Caret />);
    const window: ManagedWindow = {};
    window[ColorPicker.id] = ColorPicker;
    window[Prompts.id] = Prompts;
    window[inspector.id] = inspector;
    window[caret.id] = caret;
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
          <CaretContext value={{ caret, setCaret }}>
            <Logo />
            <TerminalPreview />
            <div className={Styles.app}>{windows}</div>
            <div className={Styles.taskbar}>{minimizedWindows}</div>
          </CaretContext>
        </ColorContext>
      </PromptContext>
    </WindowContext>
  );
};

export default App;
