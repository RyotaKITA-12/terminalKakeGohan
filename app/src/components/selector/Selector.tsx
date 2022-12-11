import Styles from "./Selector.module.scss";
import { prompts } from "@/definition/prompts";
import { useContext, useState } from "react";
import { TPrompt } from "@/@types/prompt";
import { windowContext } from "@/context/window";
import { promptContext } from "@/context/prompt";

const Selector = ({ id }: { id: string }) => {
  const [selectedPrompt, setSelectedPrompt] = useState<TPrompt | undefined>();
  const { data, setWindowContext } = useContext(windowContext);
  const { promptList, setPromptList } = useContext(promptContext);
  if (!setPromptList || !promptList || !data || !setWindowContext) return <></>;
  const onClickAdd = () => {
    if (!selectedPrompt) return;
    setPromptList([...promptList, selectedPrompt]);
  };
  return (
    <div className={Styles.wrapper}>
      <select size={20} className={Styles.select} value={selectedPrompt?.value}>
        {prompts.map((prompt, index) => {
          return (
            <option
              key={index}
              onClick={() => setSelectedPrompt(prompt)}
              value={prompt.value}
            >
              {prompt.name} ({prompt.value})
            </option>
          );
        })}
      </select>
      <button onClick={onClickAdd}>追加</button>
    </div>
  );
};
export { Selector };
