import { useEffect, useState } from "react";
import { WindowContext } from "@/context/window";
import { RetroWindow } from "@/components/window";
import Styles from "./App.module.scss";
import type { ManagedWindow } from "@/@types/window";
import { createWindow } from "@/libs/createWindow";
import { Prompt } from "@/components/prompt/Prompt";
import { PromptContext } from "@/context/prompt";
import { TPromptList } from "@/@types/prompt";

const App = () => {
  const [data, setWindow] = useState<ManagedWindow>({});
  const [promptList, setPromptList] = useState<TPromptList>([]);
  //console.log(data);
  useEffect(() => {
    const ColorPicker = createWindow("COLORS", <></>);
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

  return (
    <WindowContext value={{ data: data, setWindowContext: setWindow }}>
      <PromptContext value={{ promptList, setPromptList }}>
        <div className={Styles.app}>
          {Object.keys(data)
            .reverse()
            .map((key) => {
              const value = data[key];
              return <RetroWindow window={value} key={value.id} />;
            })}
        </div>
      </PromptContext>
    </WindowContext>
  );
};

export default App;
