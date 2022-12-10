import Styles from "./Inspector.module.scss";
import { useContext, useState } from "react";
import { TProfile } from "@/@types/profile";
import { defaultProfile } from "@/definition/profile";
import { generateUuid } from "@/libs/uuid";
import { colorContext } from "@/context/color";
import { promptContext } from "@/context/prompt";
import { windowContext } from "@/context/window";
import { createWindow } from "@/libs/createWindow";
import { Rename } from "@/components/rename/Rename";

const Inspector = () => {
  const [selectedProfile, setSelectedProfile] = useState<string>("");
  const { colors, setColors } = useContext(colorContext);
  const { promptList, setPromptList } = useContext(promptContext);
  const { data, setWindowContext } = useContext(windowContext);
  if (
    !setColors ||
    !colors ||
    !setPromptList ||
    !promptList ||
    !data ||
    !setWindowContext
  )
    return <></>;
  let profiles: TProfile[] = [];
  const onClickAdd = () => {
    profiles.push({ ...defaultProfile, id: generateUuid() });
  };
  onClickAdd();
  const onClickLoad = () => {
    const target = profiles.filter((val) => val.id === selectedProfile);
    if (target.length < 1) return;
    setColors(target[0].color);
    setPromptList(target[0].prompt);
  };
  const onClickRemove = () => {
    profiles = profiles.filter((val) => val.id !== selectedProfile);
  };
  const onClickSave = () => {
    const target = profiles.filter((val) => val.id === selectedProfile);
    if (target.length < 1) return;
    target[0].prompt = promptList;
    target[0].color = colors;
  };
  const onClickRename = () => {
    const uuid = generateUuid();
    const rename = createWindow("名前変更", <Rename id={uuid} />, {
      uuid,
      closable: true,
      width: 200,
      height: 60,
    });
    setWindowContext({ [uuid]: rename, ...data });
  };
  return (
    <div className={Styles.wrapper}>
      <select
        size={20}
        className={Styles.select}
        value={selectedProfile}
        onChange={(e) => setSelectedProfile(e.target.value)}
      >
        {profiles.map((profile, index) => {
          return (
            <option key={index} value={profile.id}>
              {profile.name}
            </option>
          );
        })}
      </select>
      <div className={Styles.buttons}>
        <button onClick={onClickAdd}>追加</button>
        <button onClick={onClickLoad}>読み込み</button>
        <button onClick={onClickRemove}>削除</button>
        <button onClick={onClickRename}>名前変更</button>
        <button onClick={onClickSave}>保存</button>
      </div>
    </div>
  );
};
export { Inspector };
