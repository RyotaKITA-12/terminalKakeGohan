import { useContext, useState } from "react";
import { promptContext } from "@/context/prompt";

import Styles from "./Prompt.module.scss";
import { windowContext } from "@/context/window";
import { createWindow } from "@/libs/createWindow";
import { Selector } from "@/components/selector/Selector";
import { generateUuid } from "@/libs/uuid";

const Prompt = () => {
  const { promptList, setPromptList } = useContext(promptContext);
  const { data, setWindowContext } = useContext(windowContext);
  const [selectedPrompt, setSelectedPrompt] = useState<number>(-1);

  if (!promptList || !setPromptList || !data || !setWindowContext) return <></>;
  const onClickAdd = () => {
    const uuid = generateUuid();
    const selector = createWindow("PROMPT", <Selector />, {
      closable: true,
      uuid,
    });
    setWindowContext({ [selector.id]: selector, ...data });
  };
  const onClickRemove = () => {
    const newPrompt = [
      ...promptList.slice(0, selectedPrompt),
      ...promptList.slice(selectedPrompt + 1),
    ];
    setPromptList(newPrompt);
    if (selectedPrompt >= newPrompt.length) {
      setSelectedPrompt(newPrompt.length - 1);
    }
  };
  const onClickUp = () => {
    if (selectedPrompt - 1 < 0 || selectedPrompt >= promptList.length) return;
    promptList.splice(
      selectedPrompt - 1,
      2,
      promptList[selectedPrompt],
      promptList[selectedPrompt - 1]
    );
    setPromptList([...promptList]);
    setSelectedPrompt(selectedPrompt - 1);
  };
  const onClickDown = () => {
    if (selectedPrompt < 0 || selectedPrompt + 1 >= promptList.length) return;
    promptList.splice(
      selectedPrompt,
      2,
      promptList[selectedPrompt + 1],
      promptList[selectedPrompt]
    );
    setPromptList([...promptList]);
    setSelectedPrompt(selectedPrompt + 1);
  };
  if (promptList.length > 0 && selectedPrompt === -1) setSelectedPrompt(0);
  return (
    <div className={Styles.wrapper}>
      <select
        size={20}
        className={Styles.select}
        value={selectedPrompt}
        onChange={(e) => setSelectedPrompt(Number(e.target.value))}
      >
        {promptList.map((prompt, index) => {
          return (
            <option key={index} value={index}>
              {prompt.name} ({prompt.value})
            </option>
          );
        })}
      </select>

      <div className={Styles.control}>
        <div className={Styles.inner}>
          <button onClick={onClickAdd}>追加</button>
          <button onClick={onClickRemove}>削除</button>
        </div>
        <div className={Styles.inner}>
          <button onClick={onClickUp}>上へ</button>
          <button onClick={onClickDown}>下へ</button>
        </div>
      </div>
    </div>
  );
};
export { Prompt };
